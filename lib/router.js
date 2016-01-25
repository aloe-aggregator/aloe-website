// Start - General configuration
Router.configure({
	layoutTemplate: 'mainLayout',
	notFoundTemplate: 'notFound',
	waitOn: function (){
		return [
			// DB of offers' website 
			Meteor.subscribe('websites'),
			// DB of contract's type and equivalence
			Meteor.subscribe('contracts'),
			// DB of errors to display to users
			Meteor.subscribe('errors')
		];
	}
});

// End - General configuration

// Home Page Route
Router.route('/', function() {
	this.render('home');
	this.render('drawer', {to:'drawer'});
	this.render('footer', {to:'footer'});
}, {
	data: {
		websitesDrawer: Websites.find(),
		contractsDrawer: Contracts.find(),
	},
	name: 'home'
});

// Statistic Page Route
Router.route('/stats', function() {
	this.render('stats');
	this.render('footer', {to:'footer'});
}, {
	waitOn: function () {
		return [
			Meteor.subscribe('statistics')
		];
	},
	data: {
		statsData: Stats.find({},{dateString:1}),
		// Start - Display parameters
		pageName:'Statistiques'
		// End - Display parameters
	},
	name: 'stats'
});

// Legal Notice Page Route
Router.route('/legal-notice', function() {
	this.render('legalNotice');
	this.render('footer', {to:'footer'});
}, {
	data: {
		// Start - Display parameters
		pageName:'Mentions Légales',
		// End - Display parameters
		lnVar:Meteor.settings.public.legalNoticeVar
	},
	name: 'legal-notice'
});

// Offer/Result's list Page Route
	Router.route('/search/:offersLimit?', function () {
		this.render('search');
		this.render('drawer', {to:'drawer'});
	},{
		name: 'search'
	});

	// Offer/Result's list Page RouteController
	SearchController = RouteController.extend({
		
		// Default number of offers displyed on load
		increment: 3,

		
		// Get number of offers to display from parameters
		offersLimit: function () {
			return parseInt(this.params.offersLimit) || this.increment;
		},

		// Get search options (atm - only offersLimit) for DB query
		findOptions: function () {
			return {limit: this.offersLimit()};
		},
		
		// Get search criteria from URL's query string 
		criteria: function () {

			var criteria = {};
			

			// Doesn't initialize the criterion if it's absent from query string
			if (this.params['query'].keyword) {
				criteria['keywords'] = this.params['query'].keyword.split(',');
				// criteria['search.keyword'] = this.params['query'].keyword.replace(',', ' ');
			}
			if (this.params['query'].locationId){
				criteria['locationId'] = this.params['query'].locationId;
				// criteria['search.locationId'] = this.params['query'].locationId;
			}
			if (this.params['query'].date){
				criteria['date'] = this.params['query'].date;
				// criteria['search.date'] = this.params['query'].date;
			}
			if (this.params['query'].contracts){
				criteria['contracts'] = this.params['query'].contracts.split(',');
				// criteria['search.contracts'] = this.params['query'].contracts.split(',');
			}
			if (this.params['query'].websites){
				criteria['websites'] = this.params['query'].websites.split(',');
			}
			
			return criteria;
		},

		// Call getOffers to update and search offers based on criteria and options 
		offers: function () {
			// return OffersRaw.find(this.criteria(), this.findOptions());
			//return Offers.find(this.criteria(), this.findOptions());
			return Offers.find();
		},

		// Subscribe to offers publication
		subscriptions: function() {
			this.offersSub = Meteor.subscribe('offers', this.criteria(), this.findOptions());
		},
		
		// Transform DB's return to practical format (switch website ID to actual website's data) 
		offersList: function () {
			var offersTmp = this.offers();
			var offersList = [];
			if (offersTmp) {
				offersTmp.map(function (of) {
					of.websites.map(function (ofwb) {
						ofwb.website = Websites.findOne(ofwb.website);
					});
					offersList.push(of);
				});
			};
			return offersList;
		},

		data: function () {
			// Boolean - compare numbers of displayed offers to maximum offers limit
			var hasMore = this.offers().count() === this.offersLimit();
			// Generate next path to display more offers
			var nextPath = this.route.path({offersLimit: this.offersLimit() + this.increment}, {query: this.params['query']});
			return {
				offers: this.offersList(),
				websitesDrawer: Websites.find(),
				contractsDrawer: Contracts.find(),
				// Wait for offers subscription to be effective & for first offers to be returned
				ready: this.offersSub.ready && this.offersList().length>0,
				// Set next path to display more offers if needed
				nextPath: hasMore ? nextPath : null,
				// Start - Display parameters
				fixDrawer:'mdl-layout--fixed-drawer',
				pageName:'Recherche'
				// End - Display parameters
			};
		}
	});

// Offer's details Page Route
Router.route('/offer/:_id', function() {
	this.render('offer');
	this.render('drawer', {to:'drawer'});
	this.render('footer', {to:'footer'});
}, {
	name: 'offer',
	waitOn: function () {
		return [
			Meteor.subscribe('singleOffer', this.params._id)
		];
	},
	data: function () {
		var offerTmp = Offers.findOne(this.params._id);
		// var offerTmp = OffersRaw.findOne(this.params._id);
		
		// Transform DB's return to practical format (atm - switch website ID to actual website's data) 
		if (offerTmp) {
			offerTmp.websites.map(function (e) {
				e.website = Websites.findOne(e.website);
			});
		};
		return {
			offer: offerTmp,
			websitesDrawer: Websites.find(),
			contractsDrawer: Contracts.find(),
			// Start - Display parameters
			pageName:'Annonce'
			// End - Display parameters
		};
	}
});

Router.onBeforeAction('dataNotFound');