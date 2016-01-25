/*
Each document do the links between a place and a locationID
This collection is used as a cache to store the results of google API calls
{
	"typeArea" : '',				// String must be 'region', 'department', 'city' or 'subcity'
	"region" : 						// String name of region 
	"department" : '',				// String name of departement (optionnal)
	"city" : '',					// String name of city (optionnal)
	"subcity" : '',					// String name of subcity (optionnal)
	"insertDay" : date,				// Insertion date
	"effectiveLocationId" : ''		// String corresponding to the place
}
*/
LocationsScale = new Mongo.Collection('locationsScale');