Meteor.startup(function () {
	if (OffersRaw.find().count() === 0) {
		//Meteor.call('search', 'ingéniEUr JAVA', 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ', null, null, null, ['Keljob', 'Remixjobs'], "CHAINE_UID");
		//Meteor.call('search', 'boulanger', 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ', null, null, null, ['Apec', 'Cadremploi', 'Indeed', 'Keljob', 'Remixjobs', 'Monster'], "CHAINE_UID");
		//Meteor.call('search', 'ingéniEUr JAVA', 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ', null, null, null, ['Apec', 'Cadremploi', 'Indeed', 'Keljob', 'Remixjobs', 'Monster'], null);
		//Meteor.call('search', 'boulanger', 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ', null, null, null, ['Apec', 'Cadremploi', 'Indeed', 'Keljob', 'Remixjobs', 'Monster'], null);
	}
});