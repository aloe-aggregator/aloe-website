Meteor.startup(function() {
    OffersRaw.find().observeChanges({
        added:  function(id, rawOffer) {
            var website = Websites.findOne({_id: rawOffer.websites[0].website});
            Meteor.call('incrementStats', 'presence', website.name, 1);
        }
    });
});

Meteor.methods({
    // type : presence, click ou redirection
    incrementStats: function(type, websiteName, n) {
        var now = moment(new Date()).format('YYYYMM');
        if (Stats.find({
            dateString: now
        }).count() === 0) {
            // List of available websites in our Mongo collection
            websites = Websites.find();

            var stat = {
                dateString: now,
                presence: new Object(),
                click: new Object(),
                redirection: new Object()
            };

            websites.forEach(function(ws) {
                stat.presence[ws.name] = 0;
                stat.click[ws.name] = 0;
                stat.redirection[ws.name] = 0;
            });

            // Create document for the actual month
            Stats.insert(stat);
        }

        var incModifier = {
            $inc: {}
        };
        incModifier.$inc[type + '.' + websiteName] = n;

        Stats.update({
            dateString: now,
        }, incModifier);
    }
});