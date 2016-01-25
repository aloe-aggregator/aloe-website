Template.errors.helpers({
    errors: function() {
        errorsArray = new Array();
        Errors.find({
            userId: Session.get('userId')
        }).forEach(function (error){
        	error.message = i18n.apply(this, error.messageParams);
        	errorsArray.push(error);
        });
        return errorsArray;
    }
});

Template.error.onRendered(function() {
    var error = this.data;
    Meteor.setTimeout(function() {
        Meteor.call('deleteError', error._id);
    }, 5000);
});