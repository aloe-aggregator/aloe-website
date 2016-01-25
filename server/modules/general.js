/**
 * insert an offer in offersRaw
 * @param  {OffersRaw} offer The offer
 */
insertOffersRaw = function(offer) {
    OffersRaw.insert(offer);
};

/**
 * get a small description of an offer
 * the size of the description is defined in the settings.json
 * @param  {String} longDescription The description to cut
 * @return {String} The cut description
 */
getSmallDescription = function(longDescription) {
    charLimit = Meteor.settings.sizeOfferSmallDescription;

    check(longDescription, String);
    check(charLimit, Number);

    var returnString = '';
    if (longDescription.length > charLimit) {
        longDescription = longDescription.substring(0, charLimit)
        if (longDescription.substring(longDescription.length - 3, longDescription.length).indexOf('.') != -1) {
            longDescription = longDescription.substring(0, longDescription.length - 3);
        }
        returnString = longDescription.substring(0, charLimit) + ' ...';
    } else {
        returnString = longDescription;
    }

    return returnString;
};

/**
 * initialize general parameter to each modules for the scrap
 * the timeout is defined in the settings.json
 * @return {Object} The object to send in the header of a post/get request
 */
initParams = function() {
    return {
        timeout: Meteor.settings.timeout
    };
};

/**
 * get scrap selectors for a specified website
 * @param  {String} websiteName The website to get selectors
 * @return {Object} An object which contains all scrap selectors for the website
 */
getSelectors = function(websiteName) {
    if (websiteName == 'Remixjobs') {
        return {
            offerItem: '.job-item',
            date: 'span.job-details-right',
            offerLink: 'a.job-link',
            salary: 'ul.job-infos > li.paycheck',
            position: 'a.job-link',
            location: 'a.workplace',
            company: 'a.company',
            contract: 'a.contract',
            descrLarge: 'div.job-description',
            descrSmall: 'div.job-description'
        };
    } else if (websiteName == 'Keljob') {
        return {
            offerItem: '.job-results > div.row > div.columns',
            date: '.offre-date',
            offerLink: '.offre-title > a',
            position: '.offre-title > a > span',
            location: '.offre-location',
            company: '.offre-company > a',
            contract: '.offre-contracts',
            descrLarge: '.job-paragraph',
            descrSmall: '.job-description'
        };
    } else if (websiteName == 'Monster') {
        return {
            offerItem: 'section#resultsWrapper > .js_result_container',
            date: 'div.postedDate time[itemprop="datePosted"]',
            offerLink: 'div.jobTitle > h2 > a',
            salary: 'span[itemprop="baseSalary"]',
            position: 'div.jobTitle > h2 > a > span',
            location: 'div.location > span[itemprop="name"]',
            company: 'div.company span[itemprop="name"]',
            descrSmall: 'div.preview'
        };
    } else if (websiteName == 'Cadremploi') {
        return {
            offerItem: 'li[itemtype="http://schema.org/JobPosting"]',
            date: 'span[itemprop="datePosted"]',
            offerLink: 'div.description-offre > a.h3',
            position: 'span[itemprop="title"]',
            location: 'span[itemprop="jobLocation"]',
            company: 'a[itemprop="hiringOrganization"] > span',
            contract: 'span[itemprop="employmentType"]',
            descrLarge: 'div.job-offer__desc',
            descrSmall: 'p[itemprop="description"]'
        };
    } else {
        Meteor.call('insertLog', ['server.error.selectorsMissing', websiteName], ['server.error.selectorsExplanation']);
        return false;
    }
};