searchCadremploi = function(search, userId) {
    var iconv = Meteor.npmRequire('iconv-lite');
    var website = Websites.findOne({
        name: 'Cadremploi'
    });

    var selectors = getSelectors(website.name);
    var options = initParamsCadremploi(search);

    var link = 'http://www.cadremploi.fr/emploi/fr.cadremploi.publi.page.recherche_offres.RechercheOffresCtrl?';
    var linkListOffersOrigin = 'http://www.cadremploi.fr/emploi/liste_offres';
    var offersNb = 0;
    var offersNbSucces = 0;

    var isLastPage = false;
    var page = 1;
    do {
        try {
            // Scrap start
            var r = Meteor.http.get(link, options);

            var $$$ = cheerio.load(r.content);

            if (page == 1) {
                linkListOffers = linkListOffersOrigin + $$$('#modifRech').attr('href').substr(16) + '?';
            }
            var result = Meteor.http.call('GET', linkListOffers, initParamsSort(page));

            if (result.statusCode < 200 || result.statusCode >= 300) {
                Meteor.call('throwErrorWithLog', userId, ['public.error.scrapGeneral', website.name], 'statusCode = ' + result.statusCode + ' | URL = ' + link + ' | Options = ' + JSON.stringify(initParamsSort(page)));
                return;
            }
        } catch (e) {
            Meteor.call('throwErrorWithLog', userId, ['public.error.scrapGeneral', website.name], 'Exception = ' + JSON.stringify(e) + ' | URL = ' + link + ' | Options = ' + JSON.stringify(initParamsSort(page)));
            return;
        }

        var $ = cheerio.load(iconv.decode(result.content, 'iso-8859-1'));

        $(selectors.offerItem).each(function(index, el) {

            var offerLink = $(this).find(selectors.offerLink).attr('href');

            var tabOfferLink = offerLink.split('offre');
            offerLink = tabOfferLink[0] + 'offre?offre' + tabOfferLink[2];
            offerLink = website.url + offerLink.substr(1);

            offersNb++;
            try {
                var opt = initParams();
                opt.encoding = null;
                opt.responseType = 'buffer';
                var pageOffer = Meteor.http.call('GET', offerLink, opt);

                if (pageOffer.statusCode >= 200 && pageOffer.statusCode < 300) {
                    var $$ = cheerio.load(iconv.decode(pageOffer.content, 'iso-8859-1'));

                    offerDate = moment($(this).find(selectors.date).text().trim(), 'ddd MMM DD HH:mm:ss z YYYY').toDate();

                    // Stop 'each()' if offer is too old
                    if (search.datePub != null) {
                        if (offerDate < search.datePub) {
                            isLastPage = true;
                            return false;
                        }
                    }

                    var offer = new Object();
                    offer.search = search;
                    offer.websites = [{
                        website: website._id,
                        url: offerLink
                    }];
                    offer.dateScrap = new Date();
                    offer.datePub = offerDate;
                    offer.position = $(this).find(selectors.position).text();
                    offer.location = $(this).find(selectors.location).text().trim();
                    offer.company = $(this).find(selectors.company).text().trim();
                    offer.contractDisplayed = $(this).find(selectors.contract).text();
                    offer.contractEquivalence = $(this).find(selectors.contract).text();
                    

                    offer.description = {
                        small: $(this).find(selectors.descrSmall).text(),
                        large: ''
                    };

                    var descrLarge = '';
                    $$(selectors.descrLarge).each(function(index, el) {
                        descrLarge += $(this).html().trim();
                    });
                    offer.description.large = descrLarge;

                    insertOffersRaw(offer);
                    offersNbSucces++;
                } else {
                    Meteor.call('insertLog', ['public.error.scrapGeneral', website.name], 'StatusCode:' + pageOffer.statusCode + ' | URL = ' + url);
                }
            } catch (e) {
                Meteor.call('insertLog', ['public.error.scrapGeneral', website.name], 'Exception = ' + JSON.stringify(e) + ' | URL = ' + url);
            }
        });

        // Condition to know if the current page is the last page (<.......> : depends on your website)
        if (!$('nav.pagination > a#js-pagination-next.suivant').length) {
            isLastPage = true;
        } else {
            page++;
        }
    } while (!isLastPage);
    if (offersNb !== offersNbSucces) {
        Meteor.call('throwErrorWithLog', userId, ['public.error.scrapNbOffers', offersNb - offersNbSucces, offersNb, website.name],
            'offersNb:' + offersNb + ' - offersNbSucces:' + offersNbSucces);
    }
};

initParamsCadremploi = function(search, options) {
    var options = initParams();
    var params = new Object();
    var idRegions = {'Alsace': 1, 'Aquitaine': 2, 'Auvergne': 3, 'Basse-Normandie': 4, 'Bourgogne': 5, 'Bretagne': 6, 'Centre': 7, 'Champagne-Ardenne': 8, 'Corse': 9, 'Franche-Comté': 10, 'Guadeloupe': 22, 'Guyane': 22, 'Haute-Normandie': 11, 'Île-de-France': 12, 'La-Réunion': 22, 'Languedoc-Roussillon': 13, 'Limousin': 14, 'Lorraine': 15, 'Martinique': 22, 'Mayotte': 22, 'Midi-Pyrénées': 16, 'Nord-Pas-de-Calais': 17, 'Pays-de-la-Loire': 18, 'Picardie': 19, 'Poitou-Charentes': 20, 'Provence-Alpes-Côte-d\'Azur': 21, 'Rhône-Alpes': 22};
    var idContracts = {'CDI': [1,5], 'CDD': [2], 'Stage': [2], 'Apprentissage': [2], 'Freelance': [7,9]};
    var paramContracts = new Array();

    // General
    params.mth = 'Rechercher';
    params.redirect = '/emploi/recherche_offres';
    params.motscles = search.keyword;

    // Location
    if (search.locationId != null) {
        if (search.location.typeArea === 'region') {
            params.chk_reg = idRegions[search.location.region];
        } else {
            params.chk_dep = search.location.coDepartment;
        }
    }

    // Contracts
    if (search.contracts == null) {
        params.chk_tyc = '1,2,5,7,9';
    } else {
        arrayContracts = new Array();
        _.map(search.contracts, function(c) {
            arrayContracts = _.union(arrayContracts, idContracts[c]);
        });
        params.chk_tyc = arrayContracts.join();

        delete arrayContracts;
    }

    options.params = params;

    return options;
};

initParamsSort = function(page) {
    var options = initParams();
    options.encoding = null;
    options.responseType = 'buffer';

    var params = new Object();
    
    params.tri = 'publishedDate';
    params.page = page;

    options.params = params;

    return options;
};