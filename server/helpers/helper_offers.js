/**
* check if the rawOffer websites.website[0].website attribute
* is contained in the offer websites.website array
* @param  {String}  offer
* @param  {String}  rawOffer
* @return {Boolean}
*/
isSameWebsite = function (offer, rawOffer) {
	var same = false;
	_.each(offer.websites, function (website) {
		if(website.website === rawOffer.websites[0].website)
			same = true
		;
	});
	return same;
};

/**
* check if the rawOffer websites.website[0].url attribute
* is contained in the offer websites.website array
* @param  {String}  offer
* @param  {String}  rawOffer
* @return {Boolean}
*/
haveSameURL = function (offer, rawOffer){
	var same = false;
	_.each(offer.websites, function (website) {
		if(website.url === rawOffer.websites[0].url)
			same = true
		;
	});
	return same;
};
