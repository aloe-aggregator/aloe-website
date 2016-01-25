i18n.map('en', {
    public: {
        error: {
            scrapGeneral: '{$1} is not responding. It may have not retrieved all offers.',
            scrapNbOffers: '{$1} out of {$2} offers could not be retrieved from {$3}.',
            apiGoogleNoReply: 'Google API out of order - Search unavailable.',
            apiGoogleNoMatch: 'Search does not work with this request.',
            general: 'An error occured. Please, contact the administrator.',
        }
    },
    server: {
        error: {
            scrapUrlNoReply: 'An URL from {$1} is not responding.',
            selectorsMissing: 'Please fill out the list of selectors for this module: {$1}',
            selectorsExplanation: 'An error occured on getSelectors() call.',
            contractNotFound: 'No match found - This type of contract is not available in the database.'
        }
    }
});