/**
* Replace Special characters
* @param  {String} text The text to format
* @return {String}      Formated text
*/
replaceSpec =  function (text){
	var reg=/[àáäâèéêëçìíîïòóôõöøùúûüÿñ_-]/gi;
	var TabSpec = {
		"à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a",
		"è":"e","é":"e","ê":"e","ë":"e",
		"ì":"i","í":"i","î":"i","ï":"i",
		"ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o",
		"ù":"u","ú":"u","û":"u","ü":"u",
		"ÿ":"y",
		"ç":"c",
		"ñ":"n",
		"-":" ","_":" "
	};
	return text.replace(
		reg,
		function(){
			return TabSpec[arguments[0].toLowerCase()];
		}
	).toLowerCase();
};

/**
* Format a text in order to compare with other formated texts
* @param  {String} text The text to format
* @return {String}      Formated text
*/
formateText = function (text){
	return replaceSpec(text)				//Replace special char
	.replace(/[^a-z]/gi,' ')				//Keep only alphanumerics
	.replace(/(\b(\w{1,2})\b(\s|$))/g,'')	//Remove {1,2} words
	.replace(/\s+/g, ' ')					//Remove CR
	//.replace(/\s/g, '')					//Remove spaces
	.toUpperCase().trim();					//Convert to upper case
};

/**
 * remove all html element in a string
 * @param  {string} html text
 * @return {strinf} plain text with no html element
 */
htmlToText = function (html) {
	return cheerio.load('<body>'+html+'</body>')('body').text();
};

/**
 * remove unused caracter in a String
 * @param  {string} str text
 * @return a string with no unused caracter
 */
removeUnusedCar = function(str) {
	if(Match.test(str, String)){
    	return str.replace(/\s+/g, ' ').trim();
	}
    return null;
};

/**
 * replace a string with space in the same string with hyphen
 * @param  {string} str text
 * @return a string with hyphen
 */
spaceToHyphen = function(str) {
    return str.replace(new RegExp(' ', 'g'), '-');
};

/**
 * remove all html element
 * header
 * strong
 * and b
 * in a string
 * @param  {string} html text
 * @return {strinf} plain text with no html component
 */
htmlToTextWithoutHeaders = function (html) {
	var $ = cheerio.load('<body>'+html+'</body>');
	$("h1").text('');
	$("h2").text('');
	$("h3").text('');
	$("h4").text('');
	$("h5").text('');
	$("strong").text('');
	$("b").text('');
	return $('body').text();
};
