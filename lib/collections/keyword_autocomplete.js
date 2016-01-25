/*
Each document is a possible autocomplete keyword
that users can be find in the home of the website
in the input "keyword"
This table is completed with words of the search
Relevance must be increment by 1 each time we meet the word
The word is displayable if it is in the 75% more common word
{
	"keyword" : '',		// String - must be an alphanumeric string
	"relevance" : 1     // Number - the number of occurence of the word
	"displayable" : 1|0 // Number - if we have to display the keyword or not to the user
}
*/
KeywordAutocomplete = new Mongo.Collection('keywordAutocomplete');