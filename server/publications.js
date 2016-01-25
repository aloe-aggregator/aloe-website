// List of website (with details) processed atm
Meteor.publish('websites', function () {
	return Websites.find();
});

// List of contract's type and equivalence
Meteor.publish('contracts', function () {
	return Contracts.find();
});

// List of errors catched by server to display to users
Meteor.publish('errors', function() {
    return Errors.find();
});

// ALOE Global statistics for each websites processed atm (number of offers found, number of offers read and number of redirection)
Meteor.publish('statistics', function() {
    return Stats.find();
});

/**
 * List of offers filtered by criteria (keyword, location, contracts,...) and options (atm - only max number of offers to get)
 * @param  {Object} 	
				[String]	keywords	:	Keywords' list	
				String		locationId	:	Google PlaceId	
				String		data		:	Date in Javascript full date string format	
				String		salary		:	Salary without currency symbol	
				[String]	contracts	:	Name of type of contract's list	
				[String]	websites	:	Websites' list	
 * @param  {Object} 	
 *				Number		limit		:	Maximum number of displayed/searched offers	
 * @return [{Object}] 	[Offer]
 */
Meteor.publish('offers', function(criteria, options) {
	check(options, {
		limit: Number
	});
	return getOffers(criteria, options);
});

/**
 * Details of an offer
 * @param  {String} Id of wanted offer
 * @return {Object} Offer
 */
Meteor.publish('singleOffer', function(id) {
	check(id, String);
	return Offers.find(id);
	// return OffersRaw.find(id);
});
