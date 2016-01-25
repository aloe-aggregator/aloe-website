Template.footer.events({
	'click #contact': function () {
		AntiModals.overlay('contact', {modal:true});
	},
	'click #about': function () {
		AntiModals.overlay('about', {modal:true});
	}
});