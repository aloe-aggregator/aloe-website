/**
 * make a array with id of web site
 * @param  {Object}   Web sites from offersRaw
 * @return {Array}    array sorted and uniq id
 */
var createWebsiteId = function (websites){
	var ids = [];
	_.each(websites, function(row){
		ids.push(row.website);
	});
	return _.uniq(ids);
}

/**
* check if an offer is already inserted in the database Offers
* @param  {Object} rawOffer 		The offer to check
* @return {Object}          		this object contain the result of the analyse
*         similar.value	 			true if similar, else false
*         similar.cacheOfferId		_id of the offer on Offers database
*         similar.toCheckOfferId	undefined
*         similarities.company		true if company 	is the same between One offer in Offers database and rawOffer, else false
*         similarities.position		true if position 	is the same between One offer in Offers database and rawOffer, else false
*         similarities.location		true if location 	is the same between One offer in Offers database and rawOffer, else false
*         similarities.website		true if website 	is the same between One offer in Offers database and rawOffer, else false
*         similarities.url			true if url 		is the same between One offer in Offers database and rawOffer, else false
*         similarities.description	true if description is the same between One offer in Offers database and rawOffer, else false
*         reCheck					true if the algorithm is not sure about the similarity
*/
var checkSimpleSimilarities = function (rawOffer) {
	//initialization of the returned object
	var checkResult = {
		similar: {
			value:false,
			cacheOfferId: undefined,
			toCheckOfferId: undefined
		},
		similarities:{
			company:undefined,
			position:undefined,
			location:undefined,
			website:undefined,
			url:undefined,
			description:undefined
		},
		reCheck: false
	};

	//we check if the offer is stored in our server cache by matching the url
	var offer = Offers.findOne({
		websites:{
			$elemMatch:{
				url: rawOffer.websites[0].url
			}
		}
	});

	if(offer){
		//the offer is already in the cache
		checkResult.similarities.company     = true;
		checkResult.similarities.position    = true;
		checkResult.similarities.location    = true;
		checkResult.similarities.website     = true;
		checkResult.similarities.url         = true;
		checkResult.similarities.description = true;
		checkResult.similar.value            = true;
		checkResult.similar.cacheOfferId     = offer._id;
	}else{
		offer = null;
		checkResult.similarities.url = false;

		//for each offer in the server cache
		_.each(Offers.find().fetch(), function (offer) {
			if(!checkResult.similar.value && !checkResult.reCheck){

				//we check if the offer is from the same company
				if(offer.company.toUpperCase() === rawOffer.company.toUpperCase()){
					checkResult.similarities.company = true;

					//we check if the offers titles are nearly similar
					if(formateText(offer.position) === formateText(rawOffer.position)){
						checkResult.similarities.position = true;

						if(isLocIncluded(offer.effectiveLocationId, rawOffer.effectiveLocationId) !==  -1){
							checkResult.similarities.location = true;

							if(isSameWebsite(offer, rawOffer)){

								checkResult.similarities.website = true;
								if(offer.description.large === rawOffer.description.large){
									//DUPLICATION
									checkResult.similarities.description = true;
									checkResult.similar.value            = true;
									checkResult.similar.cacheOfferId     = offer._id;
								}
							}else{
								//MAYBE DUPLICATION
								checkResult.similarities.website = false;
								checkResult.reCheck           = true;
								checkResult.similar.value        = true;
								checkResult.similar.cacheOfferId = offer._id;
							}
						}else{
							checkResult.similarities.location = false;
						}
					}else{
						checkResult.similarities.position = false;
					}
				}else{
					checkResult.similarities.company = false;
				}
			}
		});
	}
	return checkResult;
};

/**
 * check if 2 strings are similar
 * @param  {String} text1 Text to compare (plain)
 * @param  {String} text2 Text to compare (plain)
 * @return {Boolean}      True is texts are similar, False if not
 */
var checkComplexeSimilarities = function (text1, text2) {
	//sie difference between the two texts
	var sizeDifference = Math.abs(text1.length - text2.length);
	//if the size of a smallest text is over 45% the size of the larger text
	if(100*((Math.min(text1.length, text2.length)) / (Math.max(text1.length, text2.length))) >= 45){
		//Jaccard coeficient
		var coefSimilarity = jaccard.index(text1.split(' '), text2.split(' '))*100;
		return !(coefSimilarity<Meteor.settings.minJaccardSimilarityThreshold);
	}else{
		//-compare- the Levenshtein distance (minimum number of editions beetween Two texts)
		//-with-	the difference between the two texts
		//Reveals the propention that the smallest text is included into the larger one
		var coefSimilarity = ((Math.min(levenshtein.get(text1, text2), sizeDifference))/(Math.max(levenshtein.get(text1, text2), sizeDifference)))*100;
		return !(coefSimilarity<Meteor.settings.minLevenshteinSimilarityThreshold);
	}
};

/**
 * Define what to do to each new raw offers inserted in the RawOffers database
 * @param {Object} rawOffer The raw offer inserted
 */
var offersRawObserveAddedAction = function (rawOffer) {
	//calculation of the effective location ID from the scrapped location
	var effectiveLocationId = getEffectiveLocation(rawOffer.location);
	if(!effectiveLocationId){
		//if we are not able to find the location ID, we use the locationId from search Object
		insertLocationCache(rawOffer.location, rawOffer.search.locationId);
		effectiveLocationId = rawOffer.search.locationId;
	}
	var data = {
		keywords            : replaceSpec(rawOffer.search.keyword).split(" "),
		websitesId          : createWebsiteId(rawOffer.websites),
		websites            : rawOffer.websites,
		location            : rawOffer.location,
		effectiveLocationId : effectiveLocationId,
		originalsLocations  : new Array(rawOffer.search.locationId),
		datePub             : rawOffer.datePub,
		description         : rawOffer.description,
		dateScrap           : rawOffer.dateScrap,
		company             : rawOffer.company,
		salary              : rawOffer.salary,
		position            : rawOffer.position,
		contractDisplayed   : rawOffer.contractDisplayed,
		contractEquivalence : rawOffer.contractEquivalence
	};

	//get the checkResult Object
	rawOffer.effectiveLocationId = effectiveLocationId;
	var checkResult = checkSimpleSimilarities(rawOffer);

	//If not similarity: insertion
	//else update the already inserted data
	if(!checkResult.similar.value){
		data.effectiveLocation = getLocationScale(data.effectiveLocationId);

		Offers.insert(data);
	}else{
		if(checkResult.reCheck){
			var isSimilar = checkComplexeSimilarities(
				formateText(htmlToTextWithoutHeaders(Offers.findOne({_id:checkResult.similar.cacheOfferId}).description.large)),
				formateText(htmlToTextWithoutHeaders(rawOffer.description.large))
			);
			if(isSimilar){
				updateOffer(checkResult.similar.cacheOfferId,data);
			}
		}else{
			updateOffer(checkResult.similar.cacheOfferId,data);
		}
	}
	//Erase the raw offer from the RawOFfers database
	OffersRaw.remove({"_id":rawOffer._id});
};

/**
 * Update an offers with the data in the updateData Object
 * @param  {String} originOfferId Id of the offer that have to be updateData
 * @param  {Object} updateData    contains the data of the updated offer:
 *                  keywords            : keywords array,
					websites            : origin website Object,
					location            : scraped value of the location,
					effectiveLocationId : effectiveLocationId,
					datePub             : publication Date,
					description         : description Object,
					dateScrap           : last scrap date,
					company             : company name,
					salary              : scraped salary,
					position            : scraped position,
					contractDisplayed   : scraped contract,
					contractEquivalence : equivalence contract
 * @return {Object} Mongo Object Command Output
 */
var updateOffer = function (originOfferId, updateData) {
	originOffer = Offers.findOne({_id:originOfferId});


	//set the larger descrition as the offer descrition in the server cache
	if(updateData.description.large.length > originOffer.description.large.length){
		var description = updateData.description;
	}else{
		var description = originOffer.description;
	}

	//check if locations are compatibles, and get the more precise of the two locations
	var effectiveLocationId = isLocIncluded(originOffer.effectiveLocationId, updateData.effectiveLocationId);
	if(effectiveLocationId === -1){
		//if locations are not compatible, take the location from the origin offer in priority
		//if the origin offer effectivelocationId is undefined, take the one from updateData
		effectiveLocationId = originOffer.effectiveLocationId || updateData.effectiveLocationId;
	}

	//select the more precise location
	//effectiveLocationId is the more precise locationId
	//if the originOffer.effectiveLocationId equals effectiveLocationId
	//it means that le more precise location if the one from the originOffer
	if(effectiveLocationId === originOffer.effectiveLocationId){
		var location = originOffer.location;
		var effectiveLocation = originOffer.effectiveLocation;
	}else{
		var location = updateData.location;
		var effectiveLocation = getLocationScale(updateData.effectiveLocationId);
	}

	//select the most recent publication date
	var originOfferDate = new Date(originOffer.datePub).getTime();
	var updateDataDate  = new Date(updateData.datePub).getTime();
	var datePub         = new Date(Math.max(originOfferDate, updateDataDate));

	//insert the website from the updateData if not already in the website Array
	if(isSameWebsite(originOffer, updateData)){
		var websites = originOffer.websites;
	}else{
		var websites = _.union(originOffer.websites, updateData.websites);
	}

	//initialization of the updateObject
	var updateObject = {
		keywords           : _.union(originOffer.keywords, updateData.keywords),
		websitesId         : createWebsiteId(websites),
		websites           : websites,
		location           : location,
		effectiveLocationId: effectiveLocationId,
		effectiveLocation  : effectiveLocation,
		originalsLocations  : _.union(originOffer.originalsLocations, updateData.originalsLocations),
		datePub            : datePub,
		description 	   : description,
		dateScrap          : updateData.dateScrap,
		position           : updateData.position            || originOffer.position,
		company            : updateData.company             || originOffer.company,
		salary             : updateData.salary              || originOffer.salary,
		contractDisplayed  : updateData.contractDisplayed   || originOffer.contractDisplayed,
		contractEquivalence: updateData.contractEquivalence || originOffer.contractEquivalence
	};

	//update query
	return Offers.update({_id : originOfferId}, updateObject);
}

/**
 * At meteor startup, initialize the offersRaw observer:
 * On "added" action it run the function offersRawObserveAddedAction
 */
Meteor.startup(function() {
	OffersRaw.find().observe({
		added:  function(rawOffer) {
			offersRawObserveAddedAction(rawOffer);
		}
	});
});
