Meteor.startup(function() {
    // Set default language of i18n
    i18n.setDefaultLanguage(Meteor.settings.public.languages.serverLanguage);
    i18n.setLanguage(Meteor.settings.public.languages.serverLanguage);

    // Set default display to i18n
    i18n.showMissing('<%= label %>');

    // Set default number in array Google API Key
    idGglApiKey = 0;
    // Set the number of Google API Key
    nbGglKeyAPI = Meteor.settings.public.gglKeyAPI.length;
});

Meteor.methods({
    /**
     * search offers in websites with parameters
     * only launch each search modules asynchronously

     * Only keyword, websites and userId are necessary
     * @param  {String}       keyword     Keyword to search
     * @param  {List[String]} websites    Websites to search
     * @param  String         userId      Session Id of the user

     * Others can be defined or not (null if not defined)
     * @param  {String}       locationId  API Google ID
     * @param  {Date}         datePub     Date max to search
     * @param  {List[String]} contracts   List contracts defined in mongo
     */
    search: function(keyword, locationId, datePub, contracts, websites, userId) {
        NonEmptyString = Match.Where(function(str) {
            check(str, String);
            return str.length > 0;
        });
        check(keyword, NonEmptyString);
        keyword = keyword.trim();

        check(websites, [String]);
        WebsitesInArray = Match.Where(function(websites) {
            _.map(websites, function(ws) {
                if (Websites.find({
                    name: ws
                }).count === 0) {
                    return false;
                }
            });
            return true;
        });
        check(websites, WebsitesInArray);

        if (locationId != null) {
            check(locationId, NonEmptyString);
        }

        if (contracts != null) {
            check(contracts, [String]);
            ContractsInArray = Match.Where(function(contracts) {
                _.map(contracts, function(ct) {
                    if (Contracts.find({
                        name: ct
                    }).count === 0) {
                        return false;
                    }
                });
                return true;
            });
            check(contracts, ContractsInArray);
        }

        if (datePub != null) {
            check(datePub, Date);
        }

        // location object initialization
        location = getLocationWithIdFromAPI(locationId, userId);
        if (location === -1) {
            return;
        }

        // search object initialization
        search = new Object();
        search.keyword = keyword;
        search.locationId = locationId;
        search.location = location;
        search.datePub = datePub;
        search.contracts = contracts;

        // Add autocomplete keywords
        Meteor.call('addAutocompleteKeyword', keyword);

        _.map(websites, function(ws) {
            Meteor.setTimeout(function() {
                var fn = global['search' + ws];
                if (typeof fn === 'function') {
                    try {
                        fn(search, userId);
                    } catch (e) {
                        Meteor.call('throwErrorWithLog', userId, ['public.error.scrapGeneral', ws], 'Exception = ' + JSON.stringify(e));
                    }
                }
            }, 0);
        });
    },

    /**
     * generate a unique id string for user session
     * @return {String} Unique string for the user session
     */
    generateGUID: function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },

    /**
     * throw an error to the user
     * insert error in the mongo database
     * @param  {String}       userId         id string of user session
     * @param  {List[String]} messageParams  params for the internalionalization ['messageId', [params,...]]
     */
    throwError: function(userId, messageParams) {
        Errors.insert({
            userId: userId,
            messageParams: messageParams
        });
    },

    /**
     * insert a log in the mongo database
     * @param  {String|List[String]} message        string or params for the internalionalization ['messageId', [params,...]]
     * @param  {String|List[String]} messageParams  string or params for the internalionalization ['messageId', [params,...]]
     */
    insertLog: function(message, explanation) {
        if (Array.isArray(message)) {
            message = i18n.apply(this, message);
        }
        if (Array.isArray(explanation)) {
            explanation = i18n.apply(this, explanation);
        }
        Logs.insert({
            date: new Date(),
            message: message,
            explanation: explanation
        });
    },

    /**
     * insert a log in the mongo database
     * and throw an error to the client
     * @param  {String}              userId         id string of user session
     * @param  {String|List[String]} message        string or params for the internalionalization ['messageId', [params,...]]
     * @param  {String|List[String]} messageParams  string or params for the internalionalization ['messageId', [params,...]]
     */
    throwErrorWithLog: function(userId, messageParams, explanation) {
        Meteor.call('insertLog', i18n.apply(this, messageParams), explanation);
        Meteor.call('throwError', userId, messageParams);
    },

    /**
     * send a mail
     * @param  {String} from     string
     * @param  {String} subject  string
     * @param  {String} text     string
     */
    sendEmail: function(from, subject, text) {
        check([from, subject, text], [String]);

        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();

        Email.send({
            to: Meteor.settings.contactEMail,
            from: from,
            subject: subject,
            text: text
        });
    },

    /**
     * delete an error by id
     * @param {String} id idError
     */
    deleteError: function(id) {
        Errors.remove(id);
    }
});
