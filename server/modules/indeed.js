searchIndeed = function(search, userId) {
    var website = Websites.findOne({
        name: 'Indeed'
    });

    var idContracts = {'CDI': 'permanent', 'CDD': 'contract', 'Stage': 'internship', 'Apprentissage': 'apprenticeship', 'Freelance': 'subcontract'};
    var arrayContractEquivalence = {'CDI': 'CDI', 'CDD': 'CDD', 'Intérim': 'CDD', 'Stage': 'Stage', 'Apprentissage / Alternance': 'Apprentissage', 'Freelance / Indépendant': 'Freelance'};

    var contracts = [];
    _.map(search.contracts, function(c) {
        contracts.push(idContracts[c]);
    });

    if (contracts.length === 0) {
        contracts.push('');
    }

    var nbOfferPerPage = 25;
    var options = initParamsIndeed(search, nbOfferPerPage);
    var offersNb = 0;
    var offersNbSucces = 0;

    var link = 'http://api.indeed.com/ads/apisearch';

    var isLastPage = false;
    options.params.start = 0;

    _.map(contracts, function(jobType) {
        options.params.jt = jobType;
        do {
            try {
                var result = Meteor.http.get(link, options);

                if (result.statusCode < 200 || result.statusCode >= 300) {
                    Meteor.call('throwErrorWithLog', userId, ['public.error.scrapGeneral', website.name], 'StatusCode = ' + e.response.statusCode + ' | URL : ' + url + ' | Options = ' + JSON.stringify(options));
                    return;
                }
            } catch (e) {
                Meteor.call('throwErrorWithLog', userId, ['public.error.scrapGeneral', website.name], 'StatusCode = ' + e.response.statusCode + ' | URL : ' + url + ' | Options = ' + JSON.stringify(options));
                return;
            }

            var content = JSON.parse(result.content);
            _.map(content.results, function(o) {
                offersNb++;

                try {
                    var res = Meteor.http.get(o.url, initParams());

                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        var offer = new Object();
                        var $ = cheerio.load(res.content);
                        
                        offer.search = search;
                        offer.websites = [{
                            website: website._id,
                            url: o.url
                        }];
                        offer.dateScrap = new Date();
                        offer.datePub = new Date(o.date);
                        offer.position = o.jobtitle;
                        offer.location = o.formattedLocationFull;
                        offer.company = o.company;

                        offer.description = {
                            small: o.snippet,
                            large: $('#job_summary').html()
                        };

                        var headerOffer = $('#job_header').text();
                        offer.contractDisplayed = null;
                        offer.contractEquivalence = null;

                        _.map(arrayContractEquivalence, function(value, key) {
                            if (headerOffer.indexOf(key) > -1) {
                                offer.contractDisplayed = key;
                                offer.contractEquivalence = value;
                            }
                        });

                        insertOffersRaw(offer);
                        offersNbSucces++;
                    } else {
                        Meteor.call('insertLog', userId, ['public.error.scrapGeneral', website.name], 'StatusCode = ' + res.statusCode + ' | URL = ' + link + ' | Options = ' + JSON.stringify(initParams()));
                        return;
                    }
                } catch (e) {
                    Meteor.call('insertLog', userId, ['public.error.scrapGeneral', website.name], 'Exception = ' + JSON.stringify(e) + ' | URL = ' + link + ' | Options = ' + JSON.stringify(options));
                    return;
                }
            });

            if (options.params.start + nbOfferPerPage > content.totalResults) {
                isLastPage = true;
            } else {
                options.params.start += nbOfferPerPage;
            }
        } while (!isLastPage);
    });

    if (offersNb !== offersNbSucces) {
        Meteor.call('throwErrorWithLog', userId, ['public.error.scrapNbOffers', offersNb - offersNbSucces, offersNb, website.name],
            'offersNb:' + offersNb + ' - offersNbSucces:' + offersNbSucces);
    }
};

initParamsIndeed = function(search, nbMax) {
    var options = initParams();
    var params = new Object();

    params.publisher = 868274777654456;
    params.v = 2;
    params.format = 'json';
    params.q = search.keyword;

    if (search.locationId != null) {
        if (search.location.typeArea === 'region') {
            params.l = search.location.region;
        } else if (search.location.typeArea === 'department') {
            params.l = search.location.department;
        } else if (search.location.typeArea === 'city') {
            params.l = search.location.city;
        }
    }

    params.sort = 'date';
    params.limit = nbMax;
    params.userip = '1.2.3.4';
    params.useragent = 'Mozilla//4.0(Firefox)';
    if (search.datePub != null) {
        params.fromage = parseInt((new Date()-search.datePub)/(24*60*60*1000));
    }
    params.filter = 1;
    params.co = 'fr';

    options.params = params;

    return options;
};