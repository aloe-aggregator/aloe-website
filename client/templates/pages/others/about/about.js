Template.about.events ({
	'click .modal-closer': function () {
		AntiModals.dismissAll();
	}
});

Template.about.rendered = function () {
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