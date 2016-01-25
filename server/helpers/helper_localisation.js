/**
 * regex for a full postal code on 5 positions
 */
var regexFullPostalCode = new RegExp('[0-9]{5}');

/**
 * regex for a short postal code on 2 positions
 */
var regexPartialPostalCode = new RegExp('[0-9]{2}');


/**
 * replace a postal code on 2 positions by a 5 positions one
 * because 2 positions are not sufficient for a Google API request
 * @param  {String} postalCode
 * @return {String} postalCode on 5 positions
 */
var replacePostalCode = function(postalCode) {
    if (regexPartialPostalCode.test(postalCode) && postalCode.length == 2) {
        var departmentName = Departements.findOne(postalCode).name;
    };
    return departmentName ? departmentName : postalCode;
}

/**
 * search if we already have this location in cache
 * if true and information still valid, return the place_id
 * @param  {String} locationString
 * @return {String} or undefined
 */
var getKnownLocation = function(locationString) {
    var loc = LocationsScrap.findOne({
        search: locationString
    });
    if (loc !== undefined) {
        var dayDiff = getDayGap(loc.inserted, new Date(), 'd');
        var isDeprecated = (dayDiff > Meteor.settings.cacheLocationsRetentionDelay);
        if (isDeprecated) {
            LocationsScrap.remove(loc._id);
        } else {
            return loc.place_id;
        }
    }
    return undefined;
}

/**
 * search the list of predictions of Google API for this string
 * @param  {String} locationString
 * @return {Object} or undefined
 */
var getLocationAutocomplete = function(locationString) {
    // Google API call
    // While the quota is over limit, we try with other google key API
    if (locationString !== '') {
        var query = 'input=' + locationString + '&language=' + Meteor.settings.public.languages.locale + '&types=(regions)' + '&components=country:' + Meteor.settings.public.languages.locale + '&key=';
        var key = Meteor.settings.public.gglKeyAPI[idGglApiKey];
        var status = "OVER_QUERY_LIMIT";
        var nbTry = 0;

        try {
            while (status === "OVER_QUERY_LIMIT" && nbTry < nbGglKeyAPI) {
                places = HTTP.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?' + query + key).data;
                status = places.status;

                if (status === 'OK') {
                    // One or several propositions
                    return places.predictions;
                } else {
                    if (status === "OVER_QUERY_LIMIT") {
                        idGglApiKey = (idGglApiKey + 1) % nbGglKeyAPI;
                        key = Meteor.settings.public.gglKeyAPI[idGglApiKey];
                        nbTry++;
                    }
                    Meteor.call('insertLog', ['public.error.apiGoogleNoReply'], places.status + ' = ' + places.error_message + ' - locationString = ' + locationString);
                }
            }
        } catch (e) {
            Meteor.call('insertLog', ['public.error.apiGoogleNoReply'], 'URL = ' + url + query + key);
        }
    }
    return undefined;
}

/**
 * search the rigth place among a list of predictions (from Google API)
 * @param  {Object} predictions
 * @param  {String} locationString
 * @return {String} or undefined
 */
var getLocationFromPredictions = function(predictions, locationString) {
    // if only 1 result : we suppose it's OK
    if (_.size(predictions) === 1) {
        return predictions[0].place_id;
    }

    // if several results, we need to search which one is correct
    else {
        var exactName = _.find(predictions, function(place) {
            var tmpDescription = place.description;
            tmpDescription = tmpDescription.split(", ");
            tmpDescription.pop(); // remove the last element of the array : the name of the country
            tmpDescription = tmpDescription.join(", ");
            tmpDescription = replaceSpec(tmpDescription.toLowerCase()); //->replace accentuation
            var tmpLocationSearch = replaceSpec(locationString.toLowerCase());
            return tmpDescription === tmpLocationSearch;
        });

        return (exactName ? exactName.place_id : undefined);
    }
}

/**
 * search if the location scraped string contains a postal code
 * @param  {String} locationString
 * @return {String} or undefined
 */
var searchPostalCode = function(locationString) {
    var tmpSearch = locationString.split(' ');
    var result = _.find(tmpSearch, function(item) {
        return (regexFullPostalCode.test(item) && item.length == 5); // we search a full postal code
    });
    if (!result) {
        result = _.find(tmpSearch, function(item) {
            return (regexPartialPostalCode.test(item) && item.length == 2); // we search a partial postal code (2 positions only)
        });
    }
    return result;
}

/**
 * Get the location objet from API
 * @param  {String} locationId location id of a place
 * @param  {String} to make message for user, if null
 * @return {Object} the location with the type of area
 */
getLocationWithIdFromAPI = function(locationId, userId) {

    userId = userId || null;

    // Initialisation location object
    var location = new Object();
    location.latitude = null;
    location.longitude = null;
    location.typeArea = null;
    location.region = null;
    location.department = null;
    location.coDepartment = null;
    location.city = null;
    location.subcity = null;

    if (locationId != null && locationId != "ChIJMVd4MymgVA0R99lHx5Y__Ws") { //ID correspond France
        // Call the Google API with parameters - placeid is the reference of the place in the Google Database
        var query = 'placeid=' + locationId + '&key=';
        var key = Meteor.settings.public.gglKeyAPI[idGglApiKey];
        var url = 'https://maps.googleapis.com/maps/api/place/details/json?';
        var status = "OVER_QUERY_LIMIT";
        var nbTry = 0;
        try {
            // While the quota is over limit, we try with other google key API
            while (status === "OVER_QUERY_LIMIT" && nbTry < nbGglKeyAPI) {
                var infoPlace = HTTP.get(url + query + key).data;
                status = infoPlace.status;

                if (status === 'OK') {
                    // Set place informations with Google API result
                    location.latitude = infoPlace.result.geometry.location.lat;
                    location.longitude = infoPlace.result.geometry.location.lng;

                    if (infoPlace.result.types.indexOf('administrative_area_level_1') !== -1) {
                        location.typeArea = 'region';
                        location.region = infoPlace.result.address_components[0].long_name;
                    } else if (infoPlace.result.types.indexOf('administrative_area_level_2') !== -1) {
                        location.typeArea = 'department';
                        location.region = infoPlace.result.address_components[1].long_name;
                        location.department = infoPlace.result.address_components[0].long_name;
                        location.coDepartment = Departements.findOne({
                            "name": location.department.replace(new RegExp('-', 'g'), ' ')
                        })._id;
                    } else if (infoPlace.result.types.indexOf('locality') !== -1) {
                        location.typeArea = 'city';
                        location.region = infoPlace.result.address_components[2].long_name;
                        location.department = infoPlace.result.address_components[1].long_name;
                        location.coDepartment = Departements.findOne({
                            "name": location.department.replace(new RegExp('-', 'g'), ' ')
                        })._id;
                        location.city = infoPlace.result.address_components[0].long_name;
                    } else if (infoPlace.result.types.indexOf('sublocality') !== -1) {
                        location.typeArea = 'subcity';
                        location.region = infoPlace.result.address_components[3].long_name;
                        location.department = infoPlace.result.address_components[2].long_name;
                        location.coDepartment = Departements.findOne({
                            "name": location.department.replace(new RegExp('-', 'g'), ' ')
                        })._id;
                        location.city = infoPlace.result.address_components[1].long_name;
                        location.subcity = infoPlace.result.address_components[0].long_name;
                    } else if (infoPlace.result.types.indexOf('postal_code') !== -1) {
                        location.typeArea = 'city';
                        location.region = infoPlace.result.address_components[3].long_name;
                        location.department = infoPlace.result.address_components[2].long_name;
                        location.coDepartment = Departements.findOne({
                            "name": location.department.replace(new RegExp('-', 'g'), ' ')
                        })._id;
                        location.city = infoPlace.result.address_components[1].long_name;
                    } else {
                        // Problem on the search parameter - placeid is valid but not allowed
                        // The search is not a department, a region or a city
                        if (userId)
                            Meteor.call('throwErrorWithLog', userId, ['public.error.apiGoogleNoMatch'], 'locationId = ' + locationId + ' | types = ' + JSON.stringify(infoPlace.result.types));
                        else
                            Meteor.call('insertLog', ['public.error.apiGoogleNoMatch'], 'locationId = ' + locationId + ' | types = ' + JSON.stringify(infoPlace.result.types));
                        return -1;
                    }
                } else {
                    if (status === "OVER_QUERY_LIMIT") {
                        idGglApiKey = (idGglApiKey + 1) % nbGglKeyAPI;
                        key = Meteor.settings.public.gglKeyAPI[idGglApiKey];
                        nbTry++;
                    }
                    Meteor.call('insertLog', ['public.error.apiGoogleNoReply'], infoPlace.status + ' = ' + infoPlace.error_message + ' - locationId = ' + locationId);
                }
            }
            if (status !== 'OK') {
                // Problem on the search with Google API
                if (userId)
                    Meteor.call('throwError', userId, ['public.error.apiGoogleNoReply']);
                return -1;
            }
        } catch (e) {
            if (userId)
                Meteor.call('throwErrorWithLog', userId, ['public.error.apiGoogleNoReply'], 'URL = ' + url + query + key);
            else
                Meteor.call('insertLog', ['public.error.apiGoogleNoReply'], 'URL = ' + url + query + key);
            return -1;
        }
    }

    return location;
}

/**
 * Get the location objet
 * @param  {String} locationId location id of a place
 * @return {Object} the location with the type of area
 */
getLocationFromId = function(locationId) {

    //First, search in cache
    var location = LocationsScale.findOne({
        "effectiveLocationId": locationId
    });
    if (location) {
        var dayDiff = getDayGap(location.insertDay, new Date(), 'd');
        var isDeprecated = (dayDiff > Meteor.settings.cacheLocationsRetentionDelay);
        if (isDeprecated) {
            LocationsScale.remove(location._id);
        } else {
            return location;
        }
    }

    //Else, search with API google
    location = getLocationWithIdFromAPI(locationId);
    if (location != -1) {
        delete location.latitude;
        delete location.longitude;
        delete location.coDepartment;

        location.insertDay = new Date();
        location.effectiveLocationId = locationId;
        LocationsScale.insert(location);
        return location;
    }
    return null;
}

/**
 * Get the location scale objet
 * @param  {String} locationId location id of a place
 * @return {Object} the locationScale object
 */
getLocationScale = function(effectiveLocationId){
    locationScale = getLocationFromId(effectiveLocationId);

    if (locationScale != null) {
        delete locationScale.insertDay;
        delete locationScale.effectiveLocationId;
        delete locationScale._id;
    } else {
        locationScale = {
            typeArea: null,
            region: null,
            department: null,
            city: null,
            subcity: null,
        }
    }

    return locationScale;
}

/**
 * check if locations is included
 * @param  {String} locationIdA location id of place A
 * @param  {String} locationIdB location id of place B
 * @return {String} the smaller of the two location
 */
isLocIncluded = function(locationIdA, locationIdB) {
	//Check the string
	if (locationIdA == locationIdB) {
		return locationIdA;
	}

	var scales = ['null', 'region', 'department', 'city', 'subcity'];
	var locationA = getLocationFromId(locationIdA);
	var locationB = getLocationFromId(locationIdB);

	if (locationA == null || locationB == null) {
		return -1;
	}

	locationA.scale = scales.indexOf(locationA.typeArea);
	locationB.scale = scales.indexOf(locationB.typeArea);

	var minScale = locationA.scale;
	if (locationA.scale > locationB.scale) minScale = locationB.scale;

	if (minScale == -1) {
		return -1;
	}

	for (var i = 0; i < minScale; i++) {
		if (locationA[scales[(i + 1)]] != locationB[scales[(i + 1)]]) {
			return -1;
		}
	}

	if (locationA.scale > locationB.scale)
		return locationIdA;
	return locationIdB;
}


/**
 * get the effective place_id of an offer if possible
 * @param  {String} locationStringSrap
 * @return {String} or undefined
 */
getEffectiveLocation = function(locationStringSrap) {

    // Normalization of the string used for the search
    check(locationStringSrap, String);
    locationStringSrap = replacePostalCode(locationStringSrap); // Case of a postal code on 2 positions --> to 5 positions
    locationStringSrap = locationStringSrap.replace(/[{()}]/g, ''); // suppression of parenthesis
    var place_id;
    var predictions;
    var postalCode;

    // Case 1 : location already known on location cache
    place_id = getKnownLocation(locationStringSrap);
    if (place_id !== undefined) {
        return place_id;
    }

    // Case 2 : Google API call for autocompletion
    predictions = getLocationAutocomplete(locationStringSrap);
    if (predictions !== undefined) {
        place_id = getLocationFromPredictions(predictions, locationStringSrap);
    }

    // Case 3 : no result, we search for a postal code in the string
    if (place_id === undefined) {
        postalCode = searchPostalCode(locationStringSrap);
        if (postalCode !== undefined) {
            postalCode = replacePostalCode(postalCode); // Case of a postal code on 2 positions --> to 5 positions

            // postal code already known on location cache
            place_id = getKnownLocation(postalCode);
            if (place_id !== undefined) {
                return place_id;
            }

            // Google API call for another autocompletion
            predictions = getLocationAutocomplete(postalCode);
            if (predictions !== undefined) {
                place_id = getLocationFromPredictions(predictions, postalCode);
            }
        }
    }
    // If new location, update of the location cache
    if (place_id !== undefined) {
        insertLocationCache(locationStringSrap, place_id);
    }
    return place_id;
}

insertLocationCache = function(locationString, place_id) {
    var location = new Object();
    location.search = locationString;
    location.place_id = place_id;
    location.inserted = new Date();
    LocationsScrap.insert(location);
}
