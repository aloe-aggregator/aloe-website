Template.home.events({
    'click #adv-search-link': function(e) {
        $('.mdl-layout__drawer-button').trigger('click');
    },
    // 'keydown #location': function (e) {
    //     if (!$(".pac-container").is(":visible")) {
    //         if (e.keyCode == 13) {
    //             $("#form-search").submit();
    //         }
    //     }
    // },
    'submit form': function(e) {
        e.preventDefault();
        var isKeywordOK = true;
        var isLocationOK = true;

        // Check if keyword is empty
        if ($('#keyword').val() == '' || $('#keyword').val() == null || $('#keyword').val() == undefined) {
            isKeywordOK = false;
            $('#keyword').parent().addClass('is-invalid');
        }

        // Check if location is valid (aka selected in the list from GoogleAPI autocompletion)
        if ($('#hide-location').val() != $('#location').val()) {
            isLocationOK = false;
            $('#location').parent().addClass('is-invalid');
        }

        // Call search function
        if (isKeywordOK && isLocationOK) {

            var websitesId = []
            var websitesName = []

            this.websitesDrawer.map(function(e) {
                websitesId.push(e._id);
                websitesName.push(e.name);
            });

            var locationId = ($('#hide-location-id').val() == '') ? null : $('#hide-location-id').val();

            Meteor.call('search', $('#keyword').val(), locationId, null, null, websitesName, Session.get('userId'), function(err, res) {
                if (err != null) {
                    Meteor.call('throwErrorWithLog', Session.get('userId'), new Array('public.error.general'), JSON.stringify(err));
                }
            });

            var query = {};
            query.keyword = $('#keyword').val().split(' ').join();

            if ($('#hide-location-id').val() != '' && $('#hide-location-id').val() != null && $('#hide-location-id').val() != undefined) {
                query.locationId = $('#hide-location-id').val();
            }

            if (websitesId != null) {
                query.websites = websitesId.join();
            }

            var drawerForm = {
               "keywords":$('#keyword').val(), 
               "location":$('#location').val(), 
               "hideLocation":$('#hide-location').val(), 
               "hideLocationId":$('#hide-location-id').val(), 
               "date":null, 
               "contracts":null, 
               "websites":null
            }
            Session.set("drawer-form", drawerForm);

            Router.go('search', {}, {
                query: query
            });
        }
    },
    // Update/Sync drawer and home input for keyword
    'input #keyword': function(e) {
        $('#keyword-drawer').val($(e.target).val());
        $('#keyword').parent().removeClass('is-invalid');
        $('#keyword-drawer').parent().removeClass('is-invalid');
        if ($(e.target).val().length > 0) {
            $('#keyword-drawer').parent().addClass('is-dirty');
        } else {
            $('#keyword-drawer').parent().removeClass('is-dirty');
        }
    },
    // Update/Sync drawer and home input for location
    'input #location': function(e) {
        $('#location-drawer').val($(e.target).val());
        if ($(e.target).val().length > 0) {
            $('#location-drawer').parent().addClass('is-dirty');
        } else {
            $('#location-drawer').parent().removeClass('is-dirty');
        }
    },
    // Update/Sync drawer and home input for location
    'change #location': function(e) {
        $('#location-drawer').val($(e.target).val());
        if ($(e.target).val().length > 0) {
            $('#location-drawer').parent().addClass('is-dirty');
        } else {
            $('#location-drawer').parent().removeClass('is-dirty');
        }
    }
});

Template.home.rendered = function() {
    
    Meteor.setTimeout(function () {
        var drawerForm = {
           "keywords":null, 
           "location":null, 
           "hideLocation":null, 
           "hideLocationId":null, 
           "date":null, 
           "contracts":null, 
           "websites":null
        }
        Session.set("drawer-form", drawerForm);
        UI._globalHelpers['updateAdvSearch']();
    }, 1000);

    this.autorun(function() {
        if (GoogleMaps.loaded()) {
            $('#location')
                .geocomplete({
                    country: "fr",
                    types: ['(regions)']
                })
                .bind("geocode:result", function(e, r) {
                    $('#hide-location').val($(this).val());
                    $('#hide-location-drawer').val($(this).val());
                    $('#hide-location-id').val(r.place_id);
                    $('#hide-location-drawer-id').val(r.place_id);
                    $('#location-drawer').val($(this).val());
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

        $("#keyword").bind("keydown", function(event) {
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
                $('#keyword-drawer').val(this.value);
                $('#keyword').parent().removeClass('is-invalid');
                $('#keyword-drawer').parent().removeClass('is-invalid');
                return false;
            }
        });
    });
};
