var dailyCacheUpdate = function() {
    Search = new Mongo.Collection(null);

    Offers.find({}).forEach(function (offer) {
        var listKeywordsDate = [];
        s = Search.findOne({locationId: offer.effectiveLocationId});
        
        if (s === undefined) {
            _.map(offer.keywords, function(kw){
                listKeywordsDate.push({keyword: kw, dateScrap: offer.dateScrap});
            });

            Search.insert({
                locationId: offer.effectiveLocationId,
                keywordsDate: listKeywordsDate
            });
        } else {
            _.map(offer.keywords, function(kw){
                keywordDate = _.findWhere(s.keywordsDate, {keyword: kw});

                if (keywordDate === undefined) {
                    Search.update({locationId: offer.effectiveLocationId}, {$set: {keywordsDate: _.union(s.keywordsDate, [{keyword: kw, dateScrap: offer.dateScrap}]) }});
                } else {
                    if (offer.dateScrap > keywordDate.dateScrap) {
                        _.map(s.keywordsDate, function(kwDt){
                            if (kwDt.keyword === kw) {
                                kwDt.dateScrap = offer.dateScrap;
                            }
                        });
                        
                        Search.update({locationId: offer.effectiveLocationId}, {$set: {keywordsDate: s.keywordsDate }});
                    }
                }
            });
        }        
    });

    Search.find({}).forEach(function (search) {
        var listWebsites = [];
        
        _.map(search.keywordsDate, function( kwDt ) {
            Websites.find({}).forEach(function (ws) {
                var threshold = getThreshold(ws._id);

                var dateThresholdMin = new Date();
                var dateThresholdMax = new Date();
                dateThresholdMin.setDate(dateThresholdMin.getDate() - threshold);
                dateThresholdMax.setDate(dateThresholdMin.getDate() - threshold + parseInt(Meteor.settings.cron.intervalDays));
                if (kwDt.dateScrap > dateThresholdMin && kwDt.dateScrap < dateThresholdMax) {
                    listWebsites.push(ws.name);
                }
            });

            if (listWebsites.length > 0) {
                Meteor.call('search', kwDt.keyword, search.locationId, null, null, listWebsites, 'cron_daily');
            }
        });
    });

    Errors.remove({userId: 'cron_daily'});
    Search.remove({});
};

var clearLocationCache = function () {
    clearLocationScrap();
    clearLocationScale();
};

var event = new Object();
event[Meteor.settings.cron.dbClearOffersResidualData] = clearOffersResidualData;
event[Meteor.settings.cron.dbClearLocation] = clearLocationCache;
event[Meteor.settings.cron.dailyCacheUpdate] = dailyCacheUpdate;

new Meteor.Cron( {
  events:event
});
