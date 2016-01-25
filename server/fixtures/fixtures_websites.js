//Document Websites
if (Websites.find().count() === 0) {
    Websites.insert({
        _id: '1',
        name: 'Apec',
        url: 'https://cadres.apec.fr/',
        logo: '/images/apec.png'
    });
    Websites.insert({
        _id: '2',
        name: 'Cadremploi',
        url: 'http://www.cadremploi.fr/',
        logo: '/images/cadremploi.png'
    });
    Websites.insert({
        _id: '3',
        name: 'Indeed',
        url: 'http://www.indeed.fr/',
        logo: '/images/indeed.png'
    });
    Websites.insert({
        _id: '4',
        name: 'Keljob',
        url: 'https://www.keljob.com/',
        logo: '/images/keljob.png'
    });
    Websites.insert({
        _id: '5',
        name: 'Remixjobs',
        url: 'https://remixjobs.com/',
        logo: '/images/remixjobs.png'
    });
    Websites.insert({
        _id: '6',
        name: 'Monster',
        url: 'http://www.monster.fr/',
        logo: '/images/monster.png'
    });
}