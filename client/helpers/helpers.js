/**
* Format date to moment.js calendar format 
* @param  {Date} Javascript date
* @return {Object} Calendar formated date (specified in main.js)
*/
Template.registerHelper("formatDate", function (date) {
	return moment(date).calendar();
});

/**
* Update advanced search (drawer) fields based on Session 
* @return 
*/
Template.registerHelper("updateAdvSearch", function () {
	var drawerForm = Session.get('drawer-form');

	if (drawerForm.keywords != null && drawerForm.keywords != undefined && drawerForm.keywords != '') {
	    $('#keyword-drawer').val(drawerForm.keywords);
	    $('#keyword-drawer').parent().addClass('is-dirty');
	} else {
	    $('#keyword-drawer').val(drawerForm.keywords);
	    $('#keyword-drawer').parent().removeClass('is-dirty');
	}
	if (drawerForm.location != null && drawerForm.location != undefined && drawerForm.location != '') {
	    $('#location-drawer').val(drawerForm.location);
	    $('#location-drawer').parent().addClass('is-dirty');
	} else {
	    $('#location-drawer').val('');
	    $('#location-drawer').parent().removeClass('is-dirty');
	}
	if (drawerForm.date != null && drawerForm.date != undefined && drawerForm.date != '') {
	    $('#date').val(drawerForm.date);
	    $('#date').parent().addClass('is-dirty');
	} else {
	    $('#date').val(drawerForm.date);
	    $('#date').parent().removeClass('is-dirty');
	}
	$('#hide-location-drawer').val(drawerForm.hideLocation);
	$('#hide-location-drawer-id').val(drawerForm.hideLocationId);
	$('.websites-switch').each(function () {
	    if (drawerForm.websites != null && drawerForm.websites != undefined) {
	        if (drawerForm.websites.indexOf($(this).val().split('#')[1]) == -1) {
	            $(this).addClass('mdl-button--selectable-unchecked');
	        } else{
	            $(this).removeClass('mdl-button--selectable-unchecked');
	        }
	    } else {
	        $(this).removeClass('mdl-button--selectable-unchecked');
	    }
	});
	$('.contract-switch').each(function () {
	    if (drawerForm.contracts != null && drawerForm.contracts != undefined) {
	        if (drawerForm.contracts.indexOf($(this).val()) == -1) {
	            document.querySelector('#'+$(this).parent().attr('id')).MaterialSwitch.off()
	        } else {
	            document.querySelector('#'+$(this).parent().attr('id')).MaterialSwitch.on()
	        }
	    } else {
	        document.querySelector('#'+$(this).parent().attr('id')).MaterialSwitch.on()
	    }
	});
});