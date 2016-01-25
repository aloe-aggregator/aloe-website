Meteor.startup(function () {
    // Get Browser language setting
    var lang = navigator.language || navigator.userLanguage;

    // Set moment.js locales based on browser language, specifics locales for fr
    if (lang == 'fr') {
        moment.locale('fr', {
            weekdays : [
                "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"
            ],
            months : [
                "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
            ],
            calendar : {
                sameDay: "[Aujourd'hui à] LT",
                nextDay: "[Demain à] LT",
                lastDay: "[Hier à] LT",
                lastWeek : 'dddd [dernier à] LT',
                nextWeek : 'dddd [prochain à] LT',
                sameElse: "dddd LL"
            }
        });
    } else {
        moment.locale(lang);
    }

    // Load and set GoogleMaps API for autocompletion
	GoogleMaps.load({
		key: Meteor.settings.public.gglKeyAPI[0],
		libraries: 'places'
	});

    // Set locale option for Highcharts (fr)
    Highcharts.setOptions({
        lang: {
            contextButtonTitle: "Chart context menu",
            decimalPoint: ",",
            downloadJPEG: "Télécharger l'image au format JPEG",
            downloadPDF: "Télécharger le document au format PDF",
            downloadPNG: "Télécharger l'image au format PNG",
            downloadSVG: "Télécharger l'image vectorielle au format SVG",
            drillUpText: "Retour à {series.name}",
            invalidDate: "Format de date invalide",
            loading: "Chargement...",
            months: [ "Janvier" , "Février" , "Mars" , "Avril" , "Mai" , "Juin" , "Juillet" , "Août" , "Septembre" , "Octobre" , "Novembre" , "Decembre"],
            noData: "Aucune donnée à afficher",
            numericSymbols: [ "k" , "M" , "G" , "T" , "P" , "E"],
            printChart: "Imprimer le graphique",
            resetZoom: "Réinitialiser le zoom",
            resetZoomTitle: "Réinitialiser le zoom niveau 1:1",
            shortMonths: [ "Jan" , "Fév" , "Mar" , "Avr" , "Mai" , "Juin" , "Juil" , "Août" , "Sep" , "Oct" , "Nov" , "Dec"],
            thousandsSep: " ",
            weekdays: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
        }
    });

    // Session start if undefined
    if(Session.get('userId') === undefined){
        Meteor.call('generateGUID', function(error, success){
            Session.set('userId', success);
        });
    }
    // Set default language of i18n
    i18n.setDefaultLanguage(Meteor.settings.public.languages.defaultLanguage);
    i18n.setLanguage(Meteor.settings.public.languages.defaultLanguage);

    // Set default display to i18n
    i18n.showMissing('<%= label %>');
});

//Init Spinner object (loading animation)
Meteor.Spinner.options = {
    lines: 13, // The number of lines to draw
    length: 10, // The length of each line
    width: 5, // The line thickness
    radius: 50, // The radius of the inner circle
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    className: 'spinner', // The CSS class to assign to the spinner
};
