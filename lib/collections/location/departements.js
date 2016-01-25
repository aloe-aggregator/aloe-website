/*
{
    _id: '05',                  // Official id given by INSEE
    name: 'Hautes Alpes',
    regionId: '93',             // id's region (a department belongs to a region)
    websites: {                 // Corresponding id used by the websites
        Apec: '05'
    }
}
*/
Departements = new Mongo.Collection('departements');