Template.loading.rendered = function() {
	this.autorun(function() {
		$('#maybe-no-result').hide();
		$('#must-be-no-result').hide();
		Meteor.setTimeout(function() {
			$('#maybe-no-result').show();
		}, 15000);
		Meteor.setTimeout(function() {
			$('.spinner-container').hide();
			$('#maybe-no-result').hide();
			$('#must-be-no-result').show();
		}, 30000);
	});
}