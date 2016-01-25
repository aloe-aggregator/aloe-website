searchKeljob = function(search, userId) {
    var website = Websites.findOne({
        name: 'Keljob'
    });

    // CSS Selectors
    var selectors = getSelectors(website.name);
    // Parameters initialisation
    var options = initParamsKeljob(search);

    // URL construction
    var link = website.url + 'recherche';

    // Date difference
    var now = new Date();
    if (search.datePub != null) {
        var dayDiff = getDayGap(search.datePub, now, 'd');
    } else {
        var dayDiff = Infinity;
    }

    var offersNb = 0;
    var offersNbSucces = 0;

    var isLastPage = false;
    do {
        try {
            // Scrap start
            var result = Meteor.http.get(link, options);

            if (result.statusCode < 200 || result.statusCode >= 300) {
                Meteor.call('throwErrorWithLog', userId, ['public.error.scrapGeneral', website.name], 'statusCode = ' + result.statusCode + ' | URL = ' + link + ' | Options = ' + JSON.stringify(options));
                return;
            }
        } catch (e) {
            Meteor.call('throwErrorWithLog', userId, ['public.error.scrapGeneral', website.name], 'Exception = ' + JSON.stringify(e) + ' | URL = ' + link + ' | Options = ' + JSON.stringify(options));
            return;
        }

        var $ = cheerio.load(result.content);

        if ($(selectors.offerItem).length != 0) {
            // For each result on the page
            $(selectors.offerItem + '> div').each(function() {
                if ($(this).hasClass('search-offer')) {
                    var dateString = $(this).find(selectors.date).text();
                    var dateSplit = dateString.split('/');
                    var datePub = new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]);

                    // If the date is valid with the datePub parameter
                    if (search.datePub === null || dayDiff >= getDayGap(datePub, now, 'd')) {

                        var url = website.url.substring(0, website.url.length - 1) + $(this).find(selectors.offerLink).attr('href');
                        offersNb++;

                        // Offer scrap start
                        try {
                            var page = Meteor.http.get(url);

                            if (page.statusCode >= 200 && page.statusCode < 300) {
                                var offer = new Object();
                                offer.search = search;
                                offer.websites = [{
                                    website: website._id,
                                    url: url
                                }];

                                offer.datePub = datePub;
                                offer.dateScrap = new Date();

                                offer.position = $(this).find(selectors.position).first().text().trim();

                                offer.location = $(this).find(selectors.location).text();

                                offer.company = $(this).find(selectors.company).text();

                                offer.contractDisplayed = $(this).find(selectors.contract).text();
                                offer.contractEquivalence = contractScrapToAloe(offer.contractDisplayed, website.name);

                                var description = new Object();

                                description.small = getSmallDescription($(this).find(selectors.descrSmall).text());
                                $$ = cheerio.load(page.content);

                                descritpionDom = $$(selectors.descrLarge).first().parent().parent();
                                descritpionDom.find('span').remove();

                                var i = 1;
                                descriptionLarge = '';
                                while (true) {
                                    if (descritpionDom.find('section:nth-child(' + i + ')').length !== 0) {
                                        descriptionLarge += descritpionDom.find('section:nth-child(' + i + ')').html();
                                        i++;
                                    } else {
                                        break;
                                    }
                                }

                                description.large = removeUnusedCar(descriptionLarge);
                                offer.description = description;

                                // Insert OffersRaw + Statistics
                                insertOffersRaw(offer);
                                offersNbSucces++;
                            } else {
                                Meteor.call('insertLog', ['public.error.scrapGeneral', website.name], 'statusCode = ' + page.statusCode + ' | URL = ' + url);
                            }
                        } catch (e) {
                            Meteor.call('insertLog', ['public.error.scrapGeneral', website.name], 'Exception = ' + JSON.stringify(e) + ' | URL = ' + url);
                        }
                    }
                }
            });
            // Pagination
            if ($('.pagination-centered').find('ul.pagination')) {
                if ($('ul.pagination > .current').next().is('li')) {
                    options.params.page = options.params.page + 1;
                } else {
                    isLastPage = true;
                }
            } else {
                isLastPage = true;
            }
        } else {
            isLastPage = true;
        }
    }
    while (!isLastPage);
    if (offersNb !== offersNbSucces) {
        Meteor.call('throwErrorWithLog', userId, ['public.error.scrapNbOffers', offersNb - offersNbSucces, offersNb, website.name],
            'offersNb:' + offersNb + ' - offersNbSucces:' + offersNbSucces);
    }
};

initParamsKeljob = function(search) {
    var options = initParams();
    var params = new Object();

    // Parameters Check & Set Request Parameters
    // Keyword
    params.q = search.keyword;

    // Page
    params.page = 1;

    // Location
    if (search.locationId != null) {
        if (search.location.typeArea === 'region') {
            params.l = search.location.region;
        } else if (search.location.typeArea === 'department') {
            params.l = search.location.department;
        } else if (search.location.typeArea === 'city') {
            params.l = search.location.city;
        } else if (search.location.typeArea === 'subcity') {
            params.l = search.location.subcity;
        }
        params.lon = search.location.longitude;
        params.lat = search.location.latitude;
    }

    // Contracts
    if (search.contracts != null) {
        params.c = '';
        _.map(search.contracts, function(ct) {
            contracts = Contracts.findOne({
                name: ct
            }).websites.Keljob;
            _.map(contracts, function(contract) {
                params.c += contract + ',';
            });
        });
        params.c = params.c.substring(0, params.c.length - 1);
    }

    // DatePub
    var now = new Date();
    if (search.datePub != null) {
        var dayDiff = getDayGap(search.datePub, now, 'd');
        if (dayDiff < 1) {
            params.d = '1d';
        } else if (dayDiff < 3) {
            params.d = '3d';
        } else if (dayDiff < 7) {
            params.d = '7d';
        } else if (dayDiff < 30) {
            params.d = '30d';
        }
    }

    options.params = params;

    return options;
};