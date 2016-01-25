Template.searchItem.events ({
	//catch click event on an offer to update stats
	'click .mdl-card__actions>a': function (e) {
		_.each($(e.currentTarget).attr("value").split(','), function (ws) {
			Meteor.call('incrementStats', 'click', ws, 1);
		});
	}
});

Template.searchItem.helpers({
	/**
	* Return website information from database using it id 
	* @param  {Number} Website ID in database
	* @return {Object} Website Object from database
	*/
	getWebsiteDetails: function (websiteID) {
		check(websiteID, Number);
		return Websites.findOne(websiteID);
	},
	/**
	* Convert an array of Websites Object into an CSV(Coma Separated Values) String of websites' name 
	* @param  {[Object]} Array of Websites Object
	* @return {String} CSV String of websites names
	*/
	websitesToCSV : function (websites) {
		var CSVString = "";
		_.each(websites, function (ws) {
			CSVString += ws["website"]["name"]+",";
		});
		return CSVString.substr(0, CSVString.length-1);
	}
});

Template.search.rendered = function () {
	// Catch scroll event to autoload next results
	$('main').scroll(function() {
		if($('main').scrollTop() + $('main').height() == $('.page-content').height()) {
			$("#load-more>a").trigger('click');
		}
	});
	Meteor.setTimeout(function () {
        UI._globalHelpers['updateAdvSearch']();
	}, 1000);
};