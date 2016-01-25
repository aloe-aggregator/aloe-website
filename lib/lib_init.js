/**
 * In this file, all the external libs are initialized
 */
Meteor.startup(function() {
    if (Meteor.isServer) {
        // Launch the scrapper
	    cheerio     = Meteor.npmRequire('cheerio');
	    levenshtein = Meteor.npmRequire('fast-levenshtein');
        jaccard     = Meteor.npmRequire('jaccard');
    }
});
