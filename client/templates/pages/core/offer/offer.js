Template.offer.events ({
	//catch click event on a redirect link to update stats
	'click .mdl-card__actions>p>a': function (e) {
		var ws = $(e.currentTarget).attr("value");
		Meteor.call('incrementStats', 'redirection', ws, 1);
	}
});

Template.offer.helpers({
	/**
	* Format date to moment.js calendar format 
	* @param  {Date} Javascript date
	* @return {Object} Calendar formated date (specified in main.js)
	*/
	cleanDescription: function (description) {
		return description
			// delete style tag
			.replace(/<font[^>]*>/g, "")
			.replace(/<\/font[^>]*>/g, "")
			.replace(/class="[^"]*"/g, "")
			.replace(/align="[^"]*"/g, "")
			.replace(/style="[^"]*"/g, "")
			// limit successive br to 2
			.replace(/(<br[^>]*>){3,}/g, "<br><br>")
			.replace(/(<[abui][^>]*>[^<>]+)<br[^>]*>([^<>]+<\/[abui][^>]*>)/g, "$1$2")
			// delete div and span tag
			.replace(/<span[^>]*>/g, "")
			.replace(/<\/span[^>]*>/g, "")
			.replace(/<div[^>]*>/g, "")
			.replace(/<\/div[^>]*>/g, "")
			// delete nbsp 
			.replace(/&#xA0;/g, " ")
			// delete (next to) empty tag <p> <b> <u> and <i>
			.replace(/<[apbui][^>]*>(?:\s*|<br>)<\/[apbui][^>]*>/g, "")
			.replace(/<b[^>]*>(?:\s?):<\/b[^>]*>/g, "")
			// delete useless tag like <i>stupid ta</i><i>g succession</i> or <b><b>title</b></b>
			.replace(/<\/strong[^>]*><strong[^>]*>/g, "")
			.replace(/<\/b[^>]*><b[^>]*>/g, "")
			.replace(/<\/u[^>]*><u[^>]*>/g, "")
			.replace(/<\/i[^>]*><i[^>]*>/g, "")
			// delete character not in between tag
			.replace(/(<\/(?:h[1-6]|[apbui])[^>]*>)[^<>]+(<\/(?:h[1-6]|[apbui])[^>]*>)/g, "$1$2")
			.replace(/(<\/(?:h[1-6]|[apbui])[^>]*>)[^<>]+(<(?:h[1-6]|[apbui])[^>]*>)/g, "$1$2")
			// transform some emphased text to title
			.replace(/<p[^>]*><strong[^>]*>([^<>]+)<\/strong[^>]*><\/p[^>]*>/g, "<h5>$1</h5>")
			.replace(/<ul[^>]*><li[^>]*><strong[^>]*>([^<>]+)<\/strong[^>]*><\/li[^>]*><\/ul[^>]*>/g, "<h5>$1</h5>")
			.replace(/<li[^>]*><strong[^>]*>([^<>]+)<\/strong[^>]*><\/li[^>]*>(<\/ul[^>]*>)/g, "$2<h5>$1</h5>")
			.replace(/<br(?:\s\/)?><b[^>]*>([^<>]+)<\/b[^>]*><br(?:\s\/)?>/g, "<h5>$1</h5>")
			.replace(/<br(?:\s\/)?><br(?:\s\/)?><strong[^>]*>([^<>]+)<\/strong[^>]*><br(?:\s\/)?><br(?:\s\/)?>/g, "<h5>$1</h5>")
			.replace(/(<\/ul[^>]*>)<b[^>]*>([^<>]+)<\/b[^>]*><br(?:\s\/)?>/g, "$1<h5>$2</h5>")
			.replace(/<p[^>]*>(?:<br(?:\s\/)?>)?<b[^>]*>([^<>]+)<\/b[^>]*>(?:<br(?:\s\/)?>)?<\/p[^>]*>/g, "<h5>$1</h5>")
			.replace(/<p[^>]*>(?:<br(?:\s\/)?>)?<b[^>]*><u[^>]*>([^<>]+)<\/u[^>]*><\/b[^>]*>(?:<br(?:\s\/)?>)?<\/p[^>]*>/g, "<h5>$1</h5>")
			// delete (next to) empty title tag
			.replace(/<h([1-6])[^>]*><\/h([1-6])[^>]*>/g, "")
			.replace(/<h([1-6])[^>]*> <\/h([1-6])[^>]*>/g, "")
			// delete <b>, <u> & <i> tag in title
			.replace(/(<h[1-6][^>]*>)<[bui][^>]*>([^<>]*)<\/[bui][^>]*>(<\/h[1-6][^>]*>)/g, "$1$2$3")
			// switch link title into simple link
			.replace(/(<a[^>]*>)<h[1-6][^>]*>([^<>]*)<\/h[1-6][^>]*>(<\/a[^>]*>)/g, "$1$2$3");
		// return description;
	}
});

Template.offer.rendered = function () {
	Meteor.setTimeout(function() {
		$('.mdl-layout__obfuscator').remove()
		document.querySelector('.mdl-layout').MaterialLayout.init();
		UI._globalHelpers['updateAdvSearch']();
	}, 1000);
};