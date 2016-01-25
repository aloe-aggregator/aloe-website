/*
Each document do the links between a keyword and a locationID
This collection is used as a cache to store the results of google API calls
{
	search: '',			// String search
	place_id: '',		// String corresponding to the searched word
	inserted: Date		// Insertion date
}
*/
LocationsScrap = new Mongo.Collection('locationsScrap');