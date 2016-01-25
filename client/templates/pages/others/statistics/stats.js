/**
* Build chart with Highchart with given data in specified div 
* @param  {Object} Data object in Highcharts format
* @param  {String} #id of the element in which chart will be build
*/
builtPie = function (data, chartId) {
	var poitFormat ="";
	if (chartId=="presence") {
		pointFormat = '<b>{point.percentage:.1f}%</b> des annonces trouvées<br>(soit <b>{point.y}</b> annonces)</b>'
	} else if (chartId=="click") {
		pointFormat = '<b>{point.percentage:.1f}%</b> des annonces consultées<br>(soit <b>{point.y}</b> clics)</b>'
	} else if (chartId=="redirection") {
		pointFormat = '<b>{point.percentage:.1f}%</b> des redirections<br>(soit <b>{point.y}</b> redirections)</b>'
	}

	$('#'+chartId).highcharts({
		chart: {
			backgroundColor: '#F2F2F2',
			plotBorderWidth: 0,
			plotShadow: false
		},
		title: {
			text: ''
		},
		credits: {
			enabled: false
		},
		tooltip: {
			headerFormat: "<strong>{point.key}</strong><br>",
			pointFormat: pointFormat
		},
		legend: {
			itemDistance: 300
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: false
				},
				showInLegend: true
			}
		},
		series: [{
			type: 'pie',
			name: 'Part',
			data: data
		}]
	});
}

/**
* Gets stats data of presence, click and redirection for specified period (from->to)
* for all websites and convert them into Highcharts format 
* @param  {String} From date formated as YYYYMM
* @param  {String} To date formated as YYYYMM
* @return {Object} An array of data in Highcharts format for .presence, .click and .redirection
*/
getStatsData = function (from, to) {
	
	var tmp = Stats.find({
		$and:[
			{dateString:{$gte:from}},
			{dateString:{$lte:to}}
		]
	});
	
	var websites = Websites.find();
	var tmpPres = new Object();
	var tmpClick = new Object();
	var tmpRedir = new Object();

	_.each(tmp.fetch(), function (monthlyStats) {
		websites.forEach(function (ws) {
			if (!tmpPres[ws.name]) {
				tmpPres[ws.name] = 0;
			}
			tmpPres[ws.name] += monthlyStats.presence[ws.name];
			
			if (!tmpClick[ws.name]) {
				tmpClick[ws.name] = 0;
			}
			tmpClick[ws.name] += monthlyStats.click[ws.name];
			
			if (!tmpRedir[ws.name]) {
				tmpRedir[ws.name] = 0;
			}
			tmpRedir[ws.name] += monthlyStats.redirection[ws.name];
		});
	});

	var dataPresence = [];
	var dataPresenceCount = 0;
	var dataClick = [];
	var dataClickCount = 0;
	var dataRedirect = [];
	var dataRedirectCount = 0;
	
	websites.forEach(function (ws) {
		dataPresence.push({"name":ws.name, "y":tmpPres[ws.name]});
		dataClick.push({"name":ws.name, "y":tmpClick[ws.name]});
		dataRedirect.push({"name":ws.name, "y":tmpRedir[ws.name]});
	});
	
	for(var i=0, len=dataPresence.length; i<len; i++) {
		dataPresenceCount += dataPresence[i]["y"];
		dataClickCount += dataClick[i]["y"];
		dataRedirectCount += dataRedirect[i]["y"];
	}

	if (dataPresenceCount == 0) dataPresence = null;
	if (dataClickCount == 0) dataClick = null;
	if (dataRedirectCount == 0) dataRedirect = null;
	
	return {"presence":dataPresence, "click":dataClick, "redirect":dataRedirect};
}

/**
* Update charts with specified from->to date and disabled indiserable
* option in select element #from and #to 
* @param  {String} From date formated as YYYYMM
* @param  {String} To date formated as YYYYMM
*/
updatePie = function (from, to) {
	var dataHighCharts = getStatsData(from, to);
	builtPie(dataHighCharts["presence"], 'presence');
	builtPie(dataHighCharts["click"], 'click');
	builtPie(dataHighCharts["redirect"], 'redirection');
	
	$("#to>option").each(function (e) {
		if ($(this).val() < $('#from').val()) {
			$(this).prop("disabled", true);
		} else {
			$(this).prop("disabled", false);
		}
	});
	$("#from>option").each(function (e) {
		if ($(this).val() > $('#to').val()) {
			$(this).prop("disabled", true);
		} else {
			$(this).prop("disabled", false);
		}
	});
}

Template.stats.helpers({
	/**
	* Format date String YYYYMM to MMMM YYYYY (ex. November 2015) 
	* @param  {String} Date string YYYYMM
	* @return {String} Date String MMMM YYYY
	*/
	formatDate: function (dateString) {
		return moment(dateString, 'YYYYMM').format('MMMM YYYY');
	}
});

Template.stats.events({
	// Update chart to selected period
	'change #from, change #to': function (e) {
		updatePie($('#from').val(), $('#to').val());
	}
});

Template.stats.rendered = function () {
	var nowString = moment(new Date()).format('YYYYMM');
	updatePie(nowString, nowString);
    $('.mdl-layout__drawer-button').remove()
};