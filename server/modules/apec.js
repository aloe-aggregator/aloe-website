searchApec = function(search, userId) {
    var website = Websites.findOne({
        name: 'Apec'
    });

    // Parameters initialisation
    var options = initParamsApec(search);

    var link = 'https://cadres.apec.fr/cms/webservices/rechercheOffre/ids';
    var offersNb = 0;
    var offersNbSucces = 0;

    var isLastPage = false;
    var dateStop = false;
    do {
        try {
            // Scrap start
            var result = Meteor.http.post(link, options);

            if (result.statusCode < 200 || result.statusCode >= 300) {
                Meteor.call('throwErrorWithLog', userId, ['public.error.scrapGeneral', website.name], 'statusCode = ' + result.statusCode + ' | URL = ' + link + ' | Options = ' + JSON.stringify(options));
                return;
            }
        } catch (e) {
            Meteor.call('throwErrorWithLog', userId, ['public.error.scrapGeneral', website.name], 'Exception = ' + JSON.stringify(e) + ' | URL = ' + link + ' | Options = ' + JSON.stringify(options));
            return;
        }

        var data = result.data;
        _.map(data.resultats, function(offerUrl) {
            if (dateStop !== true) {
                offersNb++;

                // Offer scrap start
                try {
                    var url = 'https://cadres.apec.fr/cms/webservices/' + offerUrl['@uriOffre'];
                    var pageOffer = Meteor.http.get(url);

                    if (pageOffer.statusCode >= 200 && pageOffer.statusCode < 300) {
                        // Offer second page scrap
                        try {
                            var url2 = 'https://cadres.apec.fr/cms/webservices/rechercheOffre';
                            var options2 = cloneObject(options);

                            options2.data.motsCles = pageOffer.data.numeroOffre;
                            options2.data.pagination = {
                                startIndex: 0,
                                range: 1
                            };

                            var pageOffer2 = Meteor.http.post(url2, options);

                            if (pageOffer2.statusCode >= 200 && pageOffer2.statusCode < 300) {
                                var offerContent = pageOffer.data;
                                var offerContent2 = pageOffer2.data.resultats[0];

                                // Stop the scrap if the date is after the date parameter of the search
                                if (search.datePub != null) {
                                    if (new Date(offerContent.datePublication).getTime() < search.datePub.getTime()) {
                                        offersNb--;
                                        dateStop = true;
                                    }
                                }

                                if (dateStop !== true) {
                                    // Set Offer
                                    var offer = new Object();
                                    offer.search = search;

                                    offer.dateScrap = new Date();

                                    offer.websites = [{
                                        website: website._id,
                                        url: 'https://cadres.apec.fr/home/mes-offres/recherche-des-offres-demploi/liste-des-offres-demploi.html?motsCles=' + offerContent.numeroOffre
                                    }];

                                    offer.salary = offerContent.salaireMinimum + 'K - ' + offerContent.salaireMaximum + 'K';
                                    offer.datePub = new Date(offerContent.datePublication);
                                    offer.position = offerContent.intitule;
                                    offer.location = offerContent.lieuTexte;
                                    offer.company = offerContent2.nomCommercial;
                                    offer.contractDisplayed = contractScrapToAloe(String(offerContent.idNomTypeContrat), website.name);
                                    offer.contractEquivalence = offer.contractDisplayed;
                                    var description = new Object();

                                    description.small = getSmallDescription(offerContent2.texteOffre);
                                    description.large = offerContent.texteHtml;

                                    offer.description = description;

                                    insertOffersRaw(offer);
                                    offersNbSucces++;
                                }
                            } else {
                                Meteor.call('insertLog', ['public.error.scrapGeneral', website.name], 'statusCode = ' + pageOffer2.statusCode + ' | URL2 = ' + url2);
                            }
                        } catch (e) {
                            Meteor.call('insertLog', ['public.error.scrapGeneral', website.name], 'Exception = ' + JSON.stringify(e) + ' | URL2 = ' + url2);
                        }
                    } else {
                        Meteor.call('insertLog', ['public.error.scrapGeneral', website.name], 'statusCode = ' + pageOffer.statusCode + ' | URL = ' + url);
                    }
                } catch (e) {
                    Meteor.call('insertLog', ['public.error.scrapGeneral', website.name], 'Exception = ' + JSON.stringify(e) + ' | URL = ' + url);
                }
            }
        });

        // Update var isLastPage and page
        nbResults = options.data.pagination.startIndex + options.data.pagination.range;
        if (data.totalCount < nbResults || dateStop === true) {
            isLastPage = true;
        } else {
            options.data.pagination.startIndex += options.data.pagination.range;
        }
    }
    while (!isLastPage);
    if (offersNb !== offersNbSucces) {
        Meteor.call('throwErrorWithLog', userId, ['public.error.scrapNbOffers', offersNb - offersNbSucces, offersNb, website.name],
            'offersNb:' + offersNb + ' - offersNbSucces:' + offersNbSucces);
    }
};

initParamsApec = function(search) {
    var options = initParams();
    var params = new Object();

    //Forced params
    params.activeFiltre = true;
    params.fonctions = [];
    params.typesConvention = [];
    params.niveauxExperience = [];
    params.secteursActivite = [];
    params.typeClient = "CADRE";

    // Contracts
    params.typesContrat = [];
    if (search.contracts != null) {
        _.map(search.contracts, function(ct) {
            contract = Contracts.findOne({
                name: ct
            });
            if (contract.websites.Apec != null) {
                _.map(contract.websites.Apec, function(ctApec) {
                    params.typesContrat.push(parseInt(ctApec));
                });
            }
        });
    }

    // Sorts
    params.sorts = [{
        type: "DATE",
        direction: "DESCENDING"
    }];

    // Pagination
    params.pagination = {
        startIndex: 0,
        range: 20
    };

    // Place
    params.lieux = [];
    if (search.locationId != null) {
        if (search.location.typeArea === 'region') {
            params.lieux.push(parseInt(Regions.findOne({
                name: search.location.region.replace(new RegExp('-', 'g'), ' ')
            }).websites.Apec));
        } else {
            params.lieux.push(parseInt(Departements.findOne({
                name: search.location.department.replace(new RegExp('-', 'g'), ' ')
            }).websites.Apec));
        }
    } else {
        // France is 799
        params.lieux.push(799);
    }

    // Keyword
    params.motsCles = search.keyword;

    options.data = params;
    options.headers = {
        'content-type': 'application/json'
    };

    return options;
};