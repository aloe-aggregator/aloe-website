searchMonster = function(search, userId) {
    var website = Websites.findOne({
        name: 'Monster'
    });

    // CSS Selectors
    var selectors = getSelectors(website.name);

    // Parameters initialization
    var options = initParamsMonster(search);

    // URL build
    var link = 'http://emploi.monster.fr/recherche/';

    // Date difference
    var now = new Date();
    if (search.datePub != null) {
        var dayDiff = getDayGap(search.datePub, now, 'd');
    } else {
        var dayDiff = Infinity;
    }

    // Contracts
    /*if (search.contracts != null) {
        var linkContracts = '';
        var linkContractsAdd = '';

        _.map(search.contracts, function(contract) {
            contracts = Contracts.findOne({
                name: contract
            }).websites.Monster;

            _.map(contracts, function(ct) {
                linkContracts += ct.replace('é', '%C3%A9') + '+';
                linkContractsAdd += '8';
            });
        });
        linkContracts = linkContracts.substring(0, linkContracts.length - 1) + '_' + linkContractsAdd;
        link += linkContracts;
    }*/

    var offersNb = 0;
    var offersNbSucces = 0;

    var isLastPage = false;
    var nbOffreEnCours = 0;

    do {
        try {
            // Scrap start
            var result = Meteor.http.get(link, options);

            if (result.statusCode < 200 || result.statusCode >= 300) {
                Meteor.call('throwErrorWithLog', userId, ['public.error.scrapGeneral', website.name], 'statusCode = ' + result.statusCode + ' | URL = ' + url + ' | Options = ' + JSON.stringify(options));
                return;
            }
        } catch (e) {
            Meteor.call('throwErrorWithLog', userId, ['public.error.scrapGeneral', website.name], 'Exception = ' + JSON.stringify(e) + ' | URL = ' + url + ' | Options = ' + JSON.stringify(options));
            return;
        }

        var $ = cheerio.load(result.content);

        var nbOffre = $('.page-title').first().text().trim().split(" ")[0];

        if (Match.test(parseInt(nbOffre, 10), Match.Integer)){
            nbOffre = parseInt(nbOffre, 10);

            $(selectors.offerItem).each(function(index, el) {
                /*$(this).find(selectors.date).find('span').remove();
                var datePub = removeUnusedCar($(this).find(selectors.date).text());
                var regexDatePub = new RegExp('Il y a \\d{1,3} jours');

                if (datePub == 'Aujourd\'hui') {
                    datePub = new Date();
                } else if (regexDatePub.test(datePub)) {
                    datePub = backToPastDay(datePub.substring(7, datePub.length - 6));
                } else {
                    datePub = null;
                }*/

                date = $(this).find("div.postedDate time[itemprop='datePosted']").attr('datetime');
                datePub = new Date(date);

                // If the date is valid with the datePub parameter
                if (search.datePub === null || datePub === null || dayDiff >= getDayGap(datePub, now, 'd')) {
                    var url = $(this).find(selectors.offerLink).attr('href');
                    offersNb++;

                    // Offer scrap start
                    try {
                        var page = Meteor.http.get(url);

                        if (page.statusCode >= 200 && page.statusCode < 300) {
                            var offer = new Object();
                            var description = new Object();

                            offer.search = search;
                            offer.websites = [{
                                website: website._id,
                                url: url
                            }];

                            $$ = cheerio.load(page.content);

                            offer.dateScrap = new Date();

                            offer.salary = $$(selectors.salary).text(); //
                            if (offer.salary == '') {
                                offer.salary = null;
                            }

                            offer.datePub = datePub;

                            offer.position = $(this).find(selectors.position).text();
                            offer.location = $(this).find(selectors.location).text();
                            offer.company = $(this).find(selectors.company).text();

                            // Contract
                            if ($$("dt:contains('Type de poste')").length != 0) {
                                contract = $$("dt:contains('Type de poste')").next();
                                offer.contractDisplayed = '';
                                do {
                                    offer.contractDisplayed += contract.find('span').text() + ',';
                                    contract = contract.next();
                                } while (contract.is('dd'))
                                offer.contractDisplayed = offer.contractDisplayed.substring(0, offer.contractDisplayed.length - 1);
                            } else if($$('span[itemprop="employmentType"]').text() != "") {
                                offer.contractDisplayed = $$('span[itemprop="employmentType"]').text();
                            } else {
                                offer.contractDisplayed = null;
                            }
                            offer.contractDisplayed = removeUnusedCar(offer.contractDisplayed);
                            offer.contractEquivalence = contractScrapToAloe(offer.contractDisplayed, website.name);

                            var description = new Object();
                            description.small = getSmallDescription($(this).find(selectors.descrSmall).text());

                            var descrLarge = "span#TrackingJobBody";

                            if($$(descrLarge).text() == ""){
                                descrLarge = '.jobview-section';
                            } else {
                                $$(descrLarge).remove('img');
                            }

                            description.large = removeUnusedCar($$(descrLarge).html());
                            offer.description = description;

                            insertOffersRaw(offer);
                            offersNbSucces++;
                        } else {
                            Meteor.call('insertLog', ['public.error.scrapGeneral', website.name], 'statusCode = ' + page.statusCode + ' | URL = ' + url);
                        }
                    } catch (e) {
                        Meteor.call('insertLog', ['public.error.scrapGeneral', website.name], 'Exception = ' + JSON.stringify(e) + ' | URL = ' + url);
                    }
                }
            });

            nbOffreEnCours += 25;
            if(nbOffreEnCours >= nbOffre){
                isLastPage = true;
            }else{
                options.params.page++;                
            }
            // Update isLastPage and page params
            /*if ($('div.pagingWrapper').length != 0) {
                if ($('div.pagingWrapper > div.paging > ul > .active').next().is('li')) {
                    options.params.page++;
                } else {
                    isLastPage = true;
                }
            } else {
                isLastPage = true;
            }*/
        } else {
            isLastPage = true;
        }
    } while (!isLastPage);
    if (offersNb !== offersNbSucces) {
        Meteor.call('throwErrorWithLog', userId, ['public.error.scrapNbOffers', offersNb - offersNbSucces, offersNb, website.name],
            'offersNb:' + offersNb + ' - offersNbSucces:' + offersNbSucces);
    }
};

initParamsMonster = function(search) {
    var options = initParams();
    var params = new Object();

    // Parameters Check & Set Request Parameters
    // Keyword
    params.q = spaceToHyphen(search.keyword);

    // Country France
    params.cy = 'fr';

    // Location
    // Request on Department ? -> Search on Region
    // Department unavailable on monster
    if (search.locationId != null) {
        if (search.location.typeArea === 'region' || search.location.typeArea === 'department') {
            params.where = 'Région:' + spaceToHyphen(search.location.region);
        } else if (search.location.typeArea === 'city') {
            params.where = search.location.city;
        }
    }

    // DatePub
    /*var now = new Date();
    if (search.datePub != null) {
        var dayDiff = getDayGap(search.datePub, now, 'd');
        if (dayDiff < 1) {
            params.tm = 'Aujourd\'hui';
        } else if (dayDiff < 2) {
            params.tm = '2-derniers-jours';
        } else if (dayDiff < 3) {
            params.tm = '3-derniers-jours';
        } else if (dayDiff < 7) {
            params.tm = 'Les-7-derniers-jours';
        } else if (dayDiff < 14) {
            params.tm = 'Les-14-derniers-jours';
        } else if (dayDiff < 30) {
            params.tm = '30-derniers-jours';
        }
    }*/

    //Default
    //params.rad = '20-km';

    var headers = new Object();
    headers = {
        "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:43.0) Gecko/20100101 Firefox/43.0'
    }

    //Page
    params.page = 1;

    options.params = params;
    options.headers = headers;

    return options;
};