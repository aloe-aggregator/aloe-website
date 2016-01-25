// Données préenregistrées
if (Regions.find().count() === 0) {
    Regions.insert({
        _id: '42',
        name: 'Alsace',
        websites: {
            Apec: '700'
        }
    });
    Regions.insert({
        _id: '72',
        name: 'Aquitaine',
        websites: {
            Apec: '701'
        }
    });
    Regions.insert({
        _id: '83',
        name: 'Auvergne',
        websites: {
            Apec: '702'
        }
    });
    Regions.insert({
        _id: '25',
        name: 'Basse Normandie',
        websites: {
            Apec: '703'
        }
    });
    Regions.insert({
        _id: '26',
        name: 'Bourgogne',
        websites: {
            Apec: '704'
        }
    });
    Regions.insert({
        _id: '53',
        name: 'Bretagne',
        websites: {
            Apec: '705'
        }
    });
    Regions.insert({
        _id: '24',
        name: 'Centre',
        websites: {
            Apec: '706'
        }
    });
    Regions.insert({
        _id: '21',
        name: 'Champagne Ardenne',
        websites: {
            Apec: '707'
        }
    });
    Regions.insert({
        _id: '94',
        name: 'Corse',
        websites: {
            Apec: '20'
        }
    });
    Regions.insert({
        _id: '43',
        name: 'Franche Comté',
        websites: {
            Apec: '709'
        }
    });
    /*Regions.insert({
        _id: '01',
        name: 'Guadeloupe',
        websites: {
            Apec: ''
        }
    });
    Regions.insert({
        _id: '03',
        name: 'Guyane',
        websites: {
            Apec: ''
        }
    });*/
    Regions.insert({
        _id: '23',
        name: 'Haute Normandie',
        websites: {
            Apec: '710'
        }
    });
    Regions.insert({
        _id: '11',
        name: 'Île de France',
        websites: {
            Apec: '711'
        }
    });
    /*Regions.insert({
        _id: '04',
        name: 'La Réunion',
        websites: {
            Apec: ''
        }
    });*/
    Regions.insert({
        _id: '91',
        name: 'Languedoc Roussillon',
        websites: {
            Apec: '712'
        }
    });
    Regions.insert({
        _id: '74',
        name: 'Limousin',
        websites: {
            Apec: '713'
        }
    });
    Regions.insert({
        _id: '41',
        name: 'Lorraine',
        websites: {
            Apec: '714'
        }
    });
    /*Regions.insert({
        _id: '02',
        name: 'Martinique',
        websites: {
            Apec: ''
        }
    });
    Regions.insert({
        _id: '06',
        name: 'Mayotte',
        websites: {
            Apec: ''
        }
    });*/
    Regions.insert({
        _id: '73',
        name: 'Midi Pyrénées',
        websites: {
            Apec: '715'
        }
    });
    Regions.insert({
        _id: '31',
        name: 'Nord Pas de Calais',
        websites: {
            Apec: '716'
        }
    });
    Regions.insert({
        _id: '52',
        name: 'Pays de la Loire',
        websites: {
            Apec: '717'
        }
    });
    Regions.insert({
        _id: '22',
        name: 'Picardie',
        websites: {
            Apec: '718'
        }
    });
    Regions.insert({
        _id: '54',
        name: 'Poitou Charentes',
        websites: {
            Apec: '719'
        }
    });
    Regions.insert({
        _id: '93',
        name: 'Provence Alpes Côte d\'Azur',
        websites: {
            Apec: '720'
        }
    });
    Regions.insert({
        _id: '82',
        name: 'Rhône Alpes',
        websites: {
            Apec: '721'
        }
    });
}

// Données préenregistrées
if (Departements.find().count() === 0) {
    Departements.insert({
        _id: '01',
        name: 'Ain',
        regionId: '82',
        websites: {
            Apec: '011'
        }
    });
    Departements.insert({
        _id: '02',
        name: 'Aisne',
        regionId: '22',
        websites: {
            Apec: '02'
        }
    });
    Departements.insert({
        _id: '03',
        name: 'Allier',
        regionId: '83',
        websites: {
            Apec: '033'
        }
    });
    Departements.insert({
        _id: '04',
        name: 'Alpes de Haute Provence',
        regionId: '93',
        websites: {
            Apec: '04'
        }
    });
    Departements.insert({
        _id: '05',
        name: 'Hautes Alpes',
        regionId: '93',
        websites: {
            Apec: '05'
        }
    });
    Departements.insert({
        _id: '06',
        name: 'Alpes Maritimes',
        regionId: '93',
        websites: {
            Apec: '06'
        }
    });
    Departements.insert({
        _id: '07',
        name: 'Ardèche',
        regionId: '82',
        websites: {
            Apec: '07'
        }
    });
    Departements.insert({
        _id: '08',
        name: 'Ardennes',
        regionId: '21',
        websites: {
            Apec: '08'
        }
    });
    Departements.insert({
        _id: '09',
        name: 'Ariège',
        regionId: '73',
        websites: {
            Apec: '09'
        }
    });
    Departements.insert({
        _id: '10',
        name: 'Aube',
        regionId: '21',
        websites: {
            Apec: '10'
        }
    });
    Departements.insert({
        _id: '11',
        name: 'Aude',
        regionId: '91',
        websites: {
            Apec: '11'
        }
    });
    Departements.insert({
        _id: '12',
        name: 'Aveyron',
        regionId: '73',
        websites: {
            Apec: '12'
        }
    });
    Departements.insert({
        _id: '13',
        name: 'Bouches du Rhône',
        regionId: '93',
        websites: {
            Apec: '13'
        }
    });
    Departements.insert({
        _id: '14',
        name: 'Calvados',
        regionId: '25',
        websites: {
            Apec: '14'
        }
    });
    Departements.insert({
        _id: '15',
        name: 'Cantal',
        regionId: '83',
        websites: {
            Apec: '15'
        }
    });
    Departements.insert({
        _id: '16',
        name: 'Charente',
        regionId: '54',
        websites: {
            Apec: '16'
        }
    });
    Departements.insert({
        _id: '17',
        name: 'Charente Maritime',
        regionId: '54',
        websites: {
            Apec: '17'
        }
    });
    Departements.insert({
        _id: '18',
        name: 'Cher',
        regionId: '24',
        websites: {
            Apec: '18'
        }
    });
    Departements.insert({
        _id: '19',
        name: 'Corrèze',
        regionId: '74',
        websites: {
            Apec: '19'
        }
    });
    Departements.insert({
        _id: '2A',
        name: 'Corse du Sud',
        regionId: '94',
        websites: {
            Apec: '750'
        }
    });
    Departements.insert({
        _id: '2B',
        name: 'Haute Corse',
        regionId: '94',
        websites: {
            Apec: '751'
        }
    });
    Departements.insert({
        _id: '21',
        name: 'Côte d\'Or',
        regionId: '26',
        websites: {
            Apec: '21'
        }
    });
    Departements.insert({
        _id: '22',
        name: 'Côtes d\'Armor',
        regionId: '53',
        websites: {
            Apec: '22'
        }
    });
    Departements.insert({
        _id: '23',
        name: 'Creuse',
        regionId: '74',
        websites: {
            Apec: '23'
        }
    });
    Departements.insert({
        _id: '24',
        name: 'Dordogne',
        regionId: '72',
        websites: {
            Apec: '24'
        }
    });
    Departements.insert({
        _id: '25',
        name: 'Doubs',
        regionId: '43',
        websites: {
            Apec: '25'
        }
    });
    Departements.insert({
        _id: '26',
        name: 'Drôme',
        regionId: '82',
        websites: {
            Apec: '26'
        }
    });
    Departements.insert({
        _id: '27',
        name: 'Eure',
        regionId: '23',
        websites: {
            Apec: '27'
        }
    });
    Departements.insert({
        _id: '28',
        name: 'Eure et Loir',
        regionId: '24',
        websites: {
            Apec: '28'
        }
    });
    Departements.insert({
        _id: '29',
        name: 'Finistère',
        regionId: '53',
        websites: {
            Apec: '29'
        }
    });
    Departements.insert({
        _id: '30',
        name: 'Gard',
        regionId: '91',
        websites: {
            Apec: '30'
        }
    });
    Departements.insert({
        _id: '31',
        name: 'Haute Garonne',
        regionId: '73',
        websites: {
            Apec: '31'
        }
    });
    Departements.insert({
        _id: '32',
        name: 'Gers',
        regionId: '73',
        websites: {
            Apec: '32'
        }
    });
    Departements.insert({
        _id: '33',
        name: 'Gironde',
        regionId: '72',
        websites: {
            Apec: '33'
        }
    });
    Departements.insert({
        _id: '34',
        name: 'Hérault',
        regionId: '91',
        websites: {
            Apec: '34'
        }
    });
    Departements.insert({
        _id: '35',
        name: 'Ille et Vilaine',
        regionId: '53',
        websites: {
            Apec: '35'
        }
    });
    Departements.insert({
        _id: '36',
        name: 'Indre',
        regionId: '24',
        websites: {
            Apec: '36'
        }
    });
    Departements.insert({
        _id: '37',
        name: 'Indre et Loire',
        regionId: '24',
        websites: {
            Apec: '37'
        }
    });
    Departements.insert({
        _id: '38',
        name: 'Isère',
        regionId: '82',
        websites: {
            Apec: '38'
        }
    });
    Departements.insert({
        _id: '39',
        name: 'Jura',
        regionId: '43',
        websites: {
            Apec: '39'
        }
    });
    Departements.insert({
        _id: '40',
        name: 'Landes',
        regionId: '72',
        websites: {
            Apec: '40'
        }
    });
    Departements.insert({
        _id: '41',
        name: 'Loir et Cher',
        regionId: '24',
        websites: {
            Apec: '41'
        }
    });
    Departements.insert({
        _id: '42',
        name: 'Loire',
        regionId: '82',
        websites: {
            Apec: '42'
        }
    });
    Departements.insert({
        _id: '43',
        name: 'Haute Loire',
        regionId: '83',
        websites: {
            Apec: '43'
        }
    });
    Departements.insert({
        _id: '44',
        name: 'Loire Atlantique',
        regionId: '52',
        websites: {
            Apec: '44'
        }
    });
    Departements.insert({
        _id: '45',
        name: 'Loiret',
        regionId: '24',
        websites: {
            Apec: '45'
        }
    });
    Departements.insert({
        _id: '46',
        name: 'Lot',
        regionId: '73',
        websites: {
            Apec: '46'
        }
    });
    Departements.insert({
        _id: '47',
        name: 'Lot et Garonne',
        regionId: '72',
        websites: {
            Apec: '47'
        }
    });
    Departements.insert({
        _id: '48',
        name: 'Lozère',
        regionId: '91',
        websites: {
            Apec: '48'
        }
    });
    Departements.insert({
        _id: '49',
        name: 'Maine et Loire',
        regionId: '52',
        websites: {
            Apec: '49'
        }
    });
    Departements.insert({
        _id: '50',
        name: 'Manche',
        regionId: '25',
        websites: {
            Apec: '50'
        }
    });
    Departements.insert({
        _id: '51',
        name: 'Marne',
        regionId: '21',
        websites: {
            Apec: '51'
        }
    });
    Departements.insert({
        _id: '52',
        name: 'Haute Marne',
        regionId: '21',
        websites: {
            Apec: '52'
        }
    });
    Departements.insert({
        _id: '53',
        name: 'Mayenne',
        regionId: '52',
        websites: {
            Apec: '53'
        }
    });
    Departements.insert({
        _id: '54',
        name: 'Meurthe et Moselle',
        regionId: '41',
        websites: {
            Apec: '54'
        }
    });
    Departements.insert({
        _id: '55',
        name: 'Meuse',
        regionId: '41',
        websites: {
            Apec: '55'
        }
    });
    Departements.insert({
        _id: '56',
        name: 'Morbihan',
        regionId: '53',
        websites: {
            Apec: '56'
        }
    });
    Departements.insert({
        _id: '57',
        name: 'Moselle',
        regionId: '41',
        websites: {
            Apec: '57'
        }
    });
    Departements.insert({
        _id: '58',
        name: 'Nièvre',
        regionId: '26',
        websites: {
            Apec: '58'
        }
    });
    Departements.insert({
        _id: '59',
        name: 'Nord',
        regionId: '31',
        websites: {
            Apec: '59'
        }
    });
    Departements.insert({
        _id: '60',
        name: 'Oise',
        regionId: '22',
        websites: {
            Apec: '60'
        }
    });
    Departements.insert({
        _id: '61',
        name: 'Orne',
        regionId: '25',
        websites: {
            Apec: '61'
        }
    });
    Departements.insert({
        _id: '62',
        name: 'Pas de Calais',
        regionId: '31',
        websites: {
            Apec: '62'
        }
    });
    Departements.insert({
        _id: '63',
        name: 'Puy de Dôme',
        regionId: '83',
        websites: {
            Apec: '63'
        }
    });
    Departements.insert({
        _id: '64',
        name: 'Pyrénées Atlantiques',
        regionId: '72',
        websites: {
            Apec: '64'
        }
    });
    Departements.insert({
        _id: '65',
        name: 'Hautes Pyrénées',
        regionId: '73',
        websites: {
            Apec: '65'
        }
    });
    Departements.insert({
        _id: '66',
        name: 'Pyrénées Orientales',
        regionId: '91',
        websites: {
            Apec: '66'
        }
    });
    Departements.insert({
        _id: '67',
        name: 'Bas Rhin',
        regionId: '42',
        websites: {
            Apec: '67'
        }
    });
    Departements.insert({
        _id: '68',
        name: 'Haut Rhin',
        regionId: '42',
        websites: {
            Apec: '68'
        }
    });
    Departements.insert({
        _id: '69',
        name: 'Rhône',
        regionId: '82',
        websites: {
            Apec: '69'
        }
    });
    Departements.insert({
        _id: '70',
        name: 'Haute Saône',
        regionId: '43',
        websites: {
            Apec: '70'
        }
    });
    Departements.insert({
        _id: '71',
        name: 'Saône et Loire',
        regionId: '26',
        websites: {
            Apec: '71'
        }
    });
    Departements.insert({
        _id: '72',
        name: 'Sarthe',
        regionId: '52',
        websites: {
            Apec: '72'
        }
    });
    Departements.insert({
        _id: '73',
        name: 'Savoie',
        regionId: '82',
        websites: {
            Apec: '73'
        }
    });
    Departements.insert({
        _id: '74',
        name: 'Haute Savoie',
        regionId: '82',
        websites: {
            Apec: '74'
        }
    });
    Departements.insert({
        _id: '75',
        name: 'Paris',
        regionId: '11',
        websites: {
            Apec: '75'
        }
    });
    Departements.insert({
        _id: '76',
        name: 'Seine Maritime',
        regionId: '23',
        websites: {
            Apec: '76'
        }
    });
    Departements.insert({
        _id: '77',
        name: 'Seine et Marne',
        regionId: '11',
        websites: {
            Apec: '77'
        }
    });
    Departements.insert({
        _id: '78',
        name: 'Yvelines',
        regionId: '11',
        websites: {
            Apec: '78'
        }
    });
    Departements.insert({
        _id: '79',
        name: 'Deux Sèvres',
        regionId: '54',
        websites: {
            Apec: '79'
        }
    });
    Departements.insert({
        _id: '80',
        name: 'Somme',
        regionId: '22',
        websites: {
            Apec: '80'
        }
    });
    Departements.insert({
        _id: '81',
        name: 'Tarn',
        regionId: '73',
        websites: {
            Apec: '81'
        }
    });
    Departements.insert({
        _id: '82',
        name: 'Tarn et Garonne',
        regionId: '73',
        websites: {
            Apec: '82'
        }
    });
    Departements.insert({
        _id: '83',
        name: 'Var',
        regionId: '93',
        websites: {
            Apec: '83'
        }
    });
    Departements.insert({
        _id: '84',
        name: 'Vaucluse',
        regionId: '93',
        websites: {
            Apec: '84'
        }
    });
    Departements.insert({
        _id: '85',
        name: 'Vendée',
        regionId: '52',
        websites: {
            Apec: '85'
        }
    });
    Departements.insert({
        _id: '86',
        name: 'Vienne',
        regionId: '54',
        websites: {
            Apec: '86'
        }
    });
    Departements.insert({
        _id: '87',
        name: 'Haute Vienne',
        regionId: '74',
        websites: {
            Apec: '87'
        }
    });
    Departements.insert({
        _id: '88',
        name: 'Vosges',
        regionId: '41',
        websites: {
            Apec: '88'
        }
    });
    Departements.insert({
        _id: '89',
        name: 'Yonne',
        regionId: '26',
        websites: {
            Apec: '89'
        }
    });
    Departements.insert({
        _id: '90',
        name: 'Territoire de Belfort',
        regionId: '43',
        websites: {
            Apec: '90'
        }
    });
    Departements.insert({
        _id: '91',
        name: 'Essonne',
        regionId: '11',
        websites: {
            Apec: '91'
        }
    });
    Departements.insert({
        _id: '92',
        name: 'Hauts de Seine',
        regionId: '11',
        websites: {
            Apec: '92'
        }
    });
    Departements.insert({
        _id: '93',
        name: 'Seine Saint Denis',
        regionId: '11',
        websites: {
            Apec: '93'
        }
    });
    Departements.insert({
        _id: '94',
        name: 'Val de Marne',
        regionId: '11',
        websites: {
            Apec: '94'
        }
    });
    Departements.insert({
        _id: '95',
        name: 'Val d\'Oise',
        regionId: '11',
        websites: {
            Apec: '95'
        }
    });
    /*Departements.insert({
        _id: '971',
        name: 'Guadeloupe',
        regionId: '01',
        websites: {
            Apec: ''
        }
    });
    Departements.insert({
        _id: '972',
        name: 'Martinique',
        regionId: '02',
        websites: {
            Apec: ''
        }
    });
    Departements.insert({
        _id: '973',
        name: 'Guyane',
        regionId: '03',
        websites: {
            Apec: ''
        }
    });
    Departements.insert({
        _id: '974',
        name: 'La Réunion',
        regionId: '04',
        websites: {
            Apec: ''
        }
    });
    Departements.insert({
        _id: '976',
        name: 'Mayotte',
        regionId: '06',
        websites: {
            Apec: ''
        }
    });*/
}