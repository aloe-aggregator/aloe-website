Template.contact.events ({
	'click .modal-closer': function () {
		AntiModals.dismissAll();
	},
	'click #send-email': function () {
		Meteor.call('sendEmail', $('#from').val(), $('#subject').find(':selected').text(),$('#message').val());
		AntiModals.alert('Votre e-mail a bien été envoyé.');
	},
});

Template.contact.rendered = function () {
	$(window).on('keyup', function (e) {
		if (e.keyCode == 27) {
			AntiModals.dismissAll();
		}
	});
	$(window).on('click', function (e) {
		if (e.target.className == 'anti-modal-overlay')
			AntiModals.dismissAll();
	});
};