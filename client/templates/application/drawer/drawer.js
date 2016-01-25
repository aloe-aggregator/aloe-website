Template.drawer.rendered = function() {
    var picker = new Pikaday({
        field: document.getElementById('date'),
        format: 'DD/MM/YYYY',
        maxDate: new Date(),
        onSelect: function() {
            $('#date').parent().addClass('is-dirty');
        },
        i18n: {
            previousMonth: 'Mois suivant',
            nextMonth: 'Mois précédent',
            months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre'],
            weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
            weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
        }
    });

    this.autorun(function() {
        Meteor.setTimeout(function() {
            $('.mdl-layout__obfuscator').remove();
            document.querySelector('.mdl-layout').MaterialLayout.init();
        }, 1000);
        if (GoogleMaps.loaded()) {
            $('#location-drawer')
                .geocomplete({
                    country: "fr",
                    types: ['(regions)']
                })
                .bind("geocode:result", function(e, r) {
                    $('#hide-location').val($(this).val());
                    $('#hide-location-drawer').val($(this).val());
                    $('#hide-location-id').val(r.place_id);
                    $('#hide-location-drawer-id').val(r.place_id);
                    $('#location').val($(this).val());
                    $('#location').parent().removeClass('is-invalid');
                    $('#location-drawer').parent().removeClass('is-invalid');
                });
        }

        function splitAutocomplete(val) {
            return val.split(" ");
        }

        function extractLast(term) {
            return splitAutocomplete(term).pop();
        }

        $("#keyword-drawer").bind("keydown", function(event) {
            if (event.keyCode === $.ui.keyCode.TAB &&
                $(this).autocomplete("instance").menu.active) {
                event.preventDefault();
            }
        }).autocomplete({
            source: function(request, response) {
                Meteor.call('autocompleteKeywordInput', extractLast(request.term), function(error, success) {
                    response(success);
                });
            },
            search: function() {
                var term = extractLast(this.value);
                if (term.length < 2) {
                    return false;
                }
            },
            focus: function() {
                // prevent value inserted on focus
                return false;
            },
            select: function(event, ui) {
                var terms = splitAutocomplete(this.value);
                // remove the current input
                terms.pop();
                // add the selected item
                terms.push(ui.item.value);
                // add placeholder to get the space at the end
                terms.push("");
                this.value = terms.join(" ");
                $('#keyword').val(this.value);
                $('#keyword').parent().removeClass('is-invalid');
                $('#keyword-drawer').parent().removeClass('is-invalid');
                return false;
            }
        });
    });
}

Template.drawer.events({
    // 'keyup #keyword-drawer': function (e) {
    //     if (e.keyCode == 13) {
    //         // $("#form-search-drawer").submit();
    //     }
    // },
    // 'keyup #location-drawer': function (e) {
    //     if (!$(".pac-container").is(":visible")) {
    //         if (e.keyCode == 13) {
    //             // $("#form-search-drawer").submit();
    //         }
    //     }
    // },
    'keyup #date': function(e) {
        if (!$(".pika-single").is(":visible")) {
            if (e.keyCode == 13) {
                // $("#form-search-drawer").submit();
            }
        }
    },
    'submit form': function(e) {
        e.preventDefault();
        var isKeywordOK = true;
        var isLocationOK = true;

        if ($('#keyword-drawer').val() == '' || $('#keyword-drawer').val() == null || $('#keyword-drawer').val() == undefined) {
            isKeywordOK = false;
            $('#keyword-drawer').parent().addClass('is-invalid');
        }

        if ($('#hide-location-drawer').val() != $('#location-drawer').val()) {
            isLocationOK = false;
            $('#location-drawer').parent().addClass('is-invalid');
        }

        if (isKeywordOK && isLocationOK) {
            var date;
            if ($('#date').val() == '' || $('#date').val() == null || $('#date').val() == undefined) {
                date = null;
            } else {
                var splitDate = $('#date').val().split('/');
                date = new Date(splitDate[2], splitDate[1] - 1, splitDate[0]);
            }

            var contractsList = [];
            $('.contract-switch').each(function() {
                if ($(this).is(':checked')) {
                    contractsList.push($(this).val());
                };
            });
            if (contractsList.length === 0 || contractsList.length === $('.contract-switch').length) contractsList = null;

            var websitesName = []
            var websitesId = []
            $('.websites-switch:not(.mdl-button--selectable-unchecked)').each(function () {
                websitesId.push($(this).val().split('#')[0]);
                websitesName.push($(this).val().split('#')[1]);
            });

            if (websitesId.length===0 && websitesName.length===0) {
                $('.websites-switch').each(function () {
                    websitesName.push($(this).val().split('#')[1]);
                    websitesId.push($(this).val().split('#')[0]);
                });
            }

			var locationId = ($('#hide-location-drawer-id').val() == '') ? null:$('#hide-location-drawer-id').val();

			Meteor.call('search', $('#keyword-drawer').val(), $('#hide-location-drawer-id').val(), date, contractsList, websitesName, Session.get('userId'), function(err, res) {
                if (err != null) {
                    Meteor.call('throwErrorWithLog', Session.get('userId'), new Array('public.error.general'), JSON.stringify(err));
                }
            });

			var query = {};
			query.keyword = $('#keyword-drawer').val().split(' ').join(); 

			if ($('#hide-location-drawer-id').val() != '' && $('#hide-location-drawer-id').val() != null && $('#hide-location-drawer-id').val() != undefined){
				query.locationId = $('#hide-location-drawer-id').val();
			} 

			if (date != null){
				query.date = date;
			} 

			if (contractsList != null){
				query.contracts = contractsList.join();
			} 

			if (websitesId != null){
				query.websites = websitesId.join();
			}

            if ($('.mdl-layout__obfuscator').hasClass('is-visible')) {
                $('.mdl-layout__obfuscator').trigger('click');
            }

            var drawerForm = {
               "keywords":$('#keyword-drawer').val(), 
               "location":$('#location-drawer').val(), 
               "hideLocation":$('#hide-location-drawer').val(), 
               "hideLocationId":$('#hide-location-drawer-id').val(), 
               "date":$('#date').val(), 
               "contracts":contractsList, 
               "websites":websitesName 
            }
            Session.set("drawer-form", drawerForm);
			
            Router.go('search', {}, {query:query});
		}

    },
    'focus .mdl-button--selectable': function(e) {
        $(e.target).toggleClass('mdl-button--selectable-unchecked');
        if ($('.websites-switch:not(.mdl-button--selectable-unchecked)').size() === 0) {
            $(e.target).toggleClass('mdl-button--selectable-unchecked');
        }
    },
    'change #location-drawer': function(e) {
        $('#location').val($(e.target).val());
        if ($(e.target).val().length > 0) {
            $('#location').parent().addClass('is-dirty');
        } else {
            $('#location').parent().removeClass('is-dirty');
        }
    },
    'input #location-drawer': function(e) {
        $('#location').val($(e.target).val());
        if ($(e.target).val().length > 0) {
            $('#location').parent().addClass('is-dirty');
        } else {
            $('#location').parent().removeClass('is-dirty');
        }
    },
    'input #keyword-drawer': function(e) {
        $('#keyword').val($(e.target).val());
        $('#keyword').parent().removeClass('is-invalid');
        $('#keyword-drawer').parent().removeClass('is-invalid');
        if ($(e.target).val().length > 0) {
            $('#keyword').parent().addClass('is-dirty');
        } else {
            $('#keyword').parent().removeClass('is-dirty');
        }
    },
    'change .contract-switch': function(e) {
        if ($('.contract-switch:checked').size() === 0) {
            document.querySelector('#' + $(e.target).parent().attr('id')).MaterialSwitch.on();
        }
    }
});
