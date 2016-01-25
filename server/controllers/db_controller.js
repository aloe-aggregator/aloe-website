/**
* Return the number of days for retention delay based on statistics
* @param  {String} _id of WebSite collection
* @return {Integer} Number of days
*/
getThreshold = function (websiteId) {
	var dayMax = Meteor.settings['cacheOffersRetentionDelay'].daysMax;
	var dayMin = Meteor.settings['cacheOffersRetentionDelay'].daysMin;
	var dateNow = moment(new Date()).format('YYYYMM');
	var statsOfMonth = Stats.findOne({dateString: dateNow});
	var website = Websites.findOne({_id: websiteId});

	var keysSorted = Object.keys(statsOfMonth.presence).sort(function(a,b){return statsOfMonth.presence[a]-statsOfMonth.presence[b]})

	var presenceMin = statsOfMonth.presence[keysSorted[0]];
	var presenceMax = statsOfMonth.presence[keysSorted[(_.size(keysSorted) - 1)]];

	var a = (dayMin-dayMax)/(presenceMax-presenceMin);
	var b = dayMin-(a*presenceMax);

	return Math.round((a*statsOfMonth.presence[website.name])+b);
}

/**
* Get contract label for Aloe
* @param  {String} Contract name on the website
* @param  {String} Name of the website
* @return {String} name of contract in aloe
*/
contractScrapToAloe = function (contractSite, websiteName){

	//Check if contractSite is not empty
	if (contractSite === "" || contractSite === null) {
		return null;
	}

	//Make the search object
	var fullName = "websites." + websiteName;
	var search = new Object();
	search[fullName] = {$in : [contractSite]};

	//First search with the complet contractSite
	var contractNames = Contracts.findOne(search);
	if (contractNames != null) {
		return contractNames.name;
	}

	//Second search on all website with the full contractSite
	delete search[fullName];
	var contractNames = [];
	var res;
    Websites.find({}).forEach(function (site) {
    	if (site.name !== websiteName) {
			search = new Object();
			fullName = "websites." + site.name;
			search[fullName] = {$in : [contractSite]};
			res = Contracts.findOne(search);
			if (res != null) {
				contractNames.push(res);
			}
    	}
    });

	contractNames = _.uniq(contractNames);
	if (contractNames.length == 1 && contractNames[0] != null) {
		return contractNames[0];
	}

	//split of contractSite in array
	var tmp = contractSite.split(/(?:,|;| |\||\/|_|\+)+/);
	var arrayContracts = [];
	_.each(tmp, function(word){
		if(_.indexOf(arrayContracts, word) === -1) arrayContracts.push(word);
	});

	fullName = "websites." + websiteName;
	search = new Object();
	search[fullName] = {$in : arrayContracts};

	//Third search (only on websiteName), if a answer is find, return the name.
	var contractNames = Contracts.findOne(search);
	if (contractNames != null) {
		return contractNames.name;
	}

	//Fourth search (on all web sites)
	delete search[fullName];
	contractNames = [];
	res = "";
    Websites.find({}).forEach(function (site) {
    	if (site.name !== websiteName) {
			search = new Object();
			fullName = "websites." + site.name;
			search[fullName] = {$in : arrayContracts};
			res = Contracts.findOne(search);
			if (res != null) {
				contractNames.push(res);
			}
    	}
    });

	contractNames = _.uniq(contractNames);
	if (contractNames.length == 1 && contractNames[0] != null) {
		return contractNames[0];
	}

	//Else: no match
	Meteor.call('insertLog', ['server.error.contractNotFound'], "contract = [" + contractSite + "] | website = [" + websiteName + "]");
	return null;
}

/**
* Clear old location in LocationsScrap collection
*/
clearLocationScrap = function () {
	var dayDiff = 0;
	var isDeprecated = false;
	LocationsScrap.find({}).forEach(function (location) {
		dayDiff = getDayGap(location.insertDay, new Date(), 'd');
		isDeprecated = (dayDiff > Meteor.settings.cacheLocationsRetentionDelay);
		if (isDeprecated) {
			LocationsScrap.remove(location._id);
		}
	});
}

/**
* Clear old location in LocationsScale collection
*/
clearLocationScale = function () {
	var dayDiff = 0;
	var isDeprecated = false;
	LocationsLadder.find({}).forEach(function (location) {
		dayDiff = getDayGap(location.insertDay, new Date(), 'd');
		isDeprecated = (dayDiff > Meteor.settings.cacheLocationsRetentionDelay);
		if (isDeprecated) {
			LocationsLadder.remove(location._id);
		}
	});
}

/**
* Format the object with web site to search offer
* @param  {Object} A mongo search of Websites
* @return {Object} The object to search. 
*/
formatWebSites = function (websites) {
	webSiteRename = [];
	_.each(websites.fetch(), function (webSite) {
		webSiteRename.push(webSite._id);
	});
	return webSiteRename;
}

/**
* Remove the old offers and return offers sorted
* @param  {Object} Search criteria
* @param  {Object} options of criteria
* @return {Object} Offers cleared and sorted. This is a mongo object. 
*/
getOffers = function (dataSearch, options){
	options.sort = {datePub : -1};

	if (dataSearch != null){

		var keywords = [];
		_.map(dataSearch.keywords, function (word) {
			keywords.push(replaceSpec(word));
		});

		//Build of search object
		var searcher = {
			"keywords": {$all: keywords}
		};

		//Format the web sites
		var websitesRaw;
		if (dataSearch.websites)
			websitesRaw = Websites.find({ "_id" : {$in:dataSearch.websites}}, {"url": 1});
		else
			websitesRaw = Websites.find({}, {"url": 1} );
		searcher.websitesId = {$in : formatWebSites(websitesRaw)};

		if (dataSearch.contracts)
			searcher.contractEquivalence = {$all: dataSearch.contracts};

		if (dataSearch.locationId != null) {
			var s1 = cloneObject(searcher);
			var s2 = cloneObject(searcher);

			var dt = new Date(dataSearch.date);
			locScale = getLocationFromId(dataSearch.locationId);
			s1['effectiveLocation.'+locScale.typeArea] = locScale[locScale.typeArea];

			s2.originalsLocations = dataSearch.locationId;

			if (dataSearch.date) {
				s1.datePub = {$gte: dt};
				s2.datePub = {$gte: dt};
			}

			searcher = {
				$or: [s1, s2]
			};
		} else {
			if (dataSearch.date) {
				var dt = new Date(dataSearch.date);
				searcher.datePub = {$gte: dt};
			}
		}

		var offersSort = Offers.find(searcher, options);
	}
	else{
		//Without search object
		var offersSort = Offers.find({}, options);
	}

	clearOffersResidualData(offersSort);
	
	return offersSort;
}

/**
* Remove the old offers.
* @param {Object} offers with some old
*/
clearOffersResidualData = function (offersSort) {

    var offersSort = offersSort || Offers.find({});

	//Remove the old offers
	var dateNow = new Date();
	var offersCleared = offersSort.map(function (offer){
		_.each(offer.websitesId, function (website){
			var timeDiff = Math.abs(dateNow - offer.dateScrap);
			var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
			if (diffDays >= getThreshold(website)) {
				Offers.remove({_id: offer._id})
			}
		});
	});

}

/**
* Get the offers from cache and scrapper sorted by date. 
* @param  {Object} Search criteria
* @param  {Object} option of criteria
* @return {Object} Offers cleared and sorted
*/
Meteor.methods({
    getOffers:function (dataSearch, options) {
		if (dataSearch != null){
			return clear(dataSearch, options);
		}
		return -1;
	}
});
