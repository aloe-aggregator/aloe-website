searchRemixjobs = function(search, userId){
    var months = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
    var website = Websites.findOne({name: 'Remixjobs'});

    var selectors = getSelectors(website.name);
    var options = initParamsRemixjobs(search);

    var link = website.url + options.location + 'Emploi-' + search.keyword;
    delete options.location;

    var offersNb = 0;
    var offersNbSucces = 0;
    var isLastPage = false;
    var page = 1;
    do {
        try {
            var result = Meteor.http.get(link + '/' + page, options);
            
            if (result.statusCode < 200 || result.statusCode >= 300) {
                Meteor.call('throwErrorWithLog', userId, ['public.error.scrapGeneral', website.name], 'statusCode = ' + result.statusCode + ' | URL = ' + link + '/' + page + ' | Options = ' + JSON.stringify(options));
                return;
            }
        } catch (e) {
            Meteor.call('throwErrorWithLog', userId, ['public.error.scrapGeneral', website.name], 'Exception = ' + JSON.stringify(e) + ' | URL = ' + link + '/' + page + ' | Options = ' + JSON.stringify(options));
            return;
        }

        var $ = cheerio.load(result.content);

        $(selectors.offerItem).each(function(index, el) {
            // get date of publication for each offer
            var regexMin = new RegExp('minute(s)?$');
            var regexDate = new RegExp('^\\d{1,2}\\s(\\w){3,4}\\.\\s\\d{4}$');

            var dateStr = $(this).find(selectors.date).text();

            if (dateStr === 'à l’instant' || regexMin.test(dateStr)) {
                var offerDate = new Date();
            } else if (regexDate.test(dateStr)) {
                var array = dateStr.split(' ');
                var year = parseInt(array[2]);
                var month = parseInt(months.indexOf(array[1].replace('.', '')));
                var day = parseInt(array[0]);

                var offerDate = new Date(year, month, day);
            } else { // format 'n heures'
                var array = dateStr.split(' ');
                var hour = array[0];
                var dateOffer = new Date();

                dateOffer.setHours(dateOffer.getHours() - parseInt(hour));
                offerDate = dateOffer;
            }

            // Stop 'each()' if offer is too old
            if (search.datePub != null) {
                if (offerDate < search.datePub) {
                    isLastPage = true;
                    return false;
                }
            }

            var offer = new Object();
            var offerLink = $(this).find(selectors.offerLink).attr('href');
            offerLink = website.url + offerLink.substr(1);

            offersNb++;
            try {
                var res = Meteor.http.get(offerLink);

                if (res.statusCode >= 200 && res.statusCode < 300) {
                    var $$ = cheerio.load(res.content);
                
                    salaryStr = $$(selectors.salary).text();
                    if (salaryStr == 'Salaire non communiqué') {
                        offer.salary = null;
                    } else{
                        if (search.salary !== null) {
                            salaryHigh = salaryStr.substr(-3, 2);
                            salary = parseInt(salaryHigh + '000');

                            if (salary < search.salary) {
                                return true;    // Next loop
                            }
                        }

                        offer.salary = salaryStr;
                    }

                    offer.datePub = offerDate;
                    offer.dateScrap = new Date();
                    offer.search = search;
                    offer.websites = [{
                        website: website._id,
                        url: offerLink
                    }];
                    offer.position = $(this).find(selectors.position).text();
                    offer.location = $(this).find(selectors.location).text();
                    offer.company = $(this).find(selectors.company).text();
                    offer.contractDisplayed = $(this).find(selectors.contract).text().trim();
                    offer.contractEquivalence = $(this).find(selectors.contract).text().trim();

                    offer.description = {
                        large: $$(selectors.descrLarge).html().trim(),
                        small: getSmallDescription($$(selectors.descrSmall).text().trim())
                    };

                    insertOffersRaw(offer);
                    offersNbSucces++;
                } else {
                    Meteor.call('insertLog', ['public.error.scrapGeneral', website.name], 'StatusCode = ' + res.statusCode);
                }
            } catch (e) {
                Meteor.call('insertLog', ['public.error.scrapGeneral', website.name], 'Exception = ' + JSON.stringify(e) + ' | URL = ' + offerLink);
            }
        });

        // Test if is the last page of results
        if ($('div.pagination > a.current + a').hasClass('prev-link') || $('div.no-element-wrapper > a.no-element').length) {
            isLastPage = true;
        } else {
            page ++;
        }
    } while (!isLastPage);
    if (offersNb !== offersNbSucces) {
        Meteor.call('throwErrorWithLog', userId, ['public.error.scrapNbOffers', offersNb - offersNbSucces, offersNb, website.name],
            'offersNb:' + offersNb + ' - offersNbSucces:' + offersNbSucces);
    }
};

initParamsRemixjobs = function (search) {
    var options = initParams();
    var params = new Object();
    var location = '';

    // Location
    if (search.locationId != null) {
        params.lat = search.location.latitude.toFixed(2);
        params.lng = search.location.longitude.toFixed(2);

        if (search.location.typeArea === 'region') {
            location = search.location.region.replace(new RegExp('-', 'g'), ' ');
            params.dist = 200;
        } else if (search.location.typeArea === 'department') {
            location = search.location.department.replace(new RegExp('-', 'g'), ' ');
            params.dist = 100;
        } else if (search.location.typeArea === 'city') {
            location = search.location.city.replace(new RegExp('-', 'g'), ' ');
            params.dist = 50;
        } else if (search.location.typeArea === 'subcity') {
            location = search.location.subcity.replace(new RegExp('-', 'g'), ' ');
            params.dist = 50;
        }
        location += ', France-';
    }

    // Contract
    if (search.contracts != null) {
        var indexApprentissage = search.contracts.indexOf('Apprentissage');
        if (indexApprentissage !== -1) {
            search.contracts.splice(indexApprentissage, 1);

            if (search.contracts.indexOf('CDD') === -1) {
                search.contracts.push('CDD');
            }
        }
        params.contract = search.contracts.join();
    }

    options.params = params;
    options.location = location;

    return options;
};