/*
{
    search: search,                 // Object received from the client
    websites: [{
        website: website._id,       // Id of the current website
        url: ''                     // Offer's URL from the origin website
    }],
    dateScrap: Date,                // Date of scrap by ALOE
    
// All the following attributes are scapped from the website
    position: '',                   // Offer's title
    location: '',                   // Offer's location (format depends on each website)
    datePub: Date,                  // Date of publication on the website
    company: '',                    // Company's name
    salary: '',                     // Salary (rarely indicated)
    contractDisplayed: '',          // Type of contrat displayed on the website
    contractEquivalence: '',        // Corresponding type of contrat from ALOE (cf. fixtures_contracts.js)
    description: {
        small: '',                  // Small description (displayed in the results list)
        large: ''                   // Complete description
}
*/
OffersRaw = new Mongo.Collection('offersRaw');