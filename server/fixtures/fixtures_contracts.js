if (Contracts.find({
    name: 'CDI'
}).count() === 0) {
    Contracts.insert({
        name: 'CDI',
        websites: {
            Keljob: ['CDI', 'Avis de concours'],
            Monster: ['CDI', 'Titulaire-de-la-fonction-publique'],
            Remixjobs: ['CDI'],
            Apec: ['101888'], // CDI
            Indeed: ['CDI'],
            Cadremploi: ['CDI', 'Statutaire']
        }
    });
}
if (Contracts.find({
    name: 'CDD'
}).count() === 0) {
    Contracts.insert({
        name: 'CDD',
        websites: {
            Keljob: ['CDD', 'Intérim', 'Saisonnier', 'VIE'],
            Monster: ['Intérim-ou-CDD-ou-Mission'],
            Remixjobs: ['CDD'],
            Apec: ['101887', '101889'], // CDD | Intérim
            Indeed: ['CDD'],
            Cadremploi: ['CDD / Intérim / VIE']
        }
    });
}
if (Contracts.find({
    name: 'Stage'
}).count() === 0) {
    Contracts.insert({
        name: 'Stage',
        websites: {
            Keljob: ['Stage'],
            Monster: ['Stage-Apprentissage-Alternance'],
            Indeed: ['Stage'],
            Remixjobs: ['Stage']
        }
    });
}
if (Contracts.find({
    name: 'Apprentissage'
}).count() === 0) {
    Contracts.insert({
        name: 'Apprentissage',
        websites: {
            Keljob: ['Apprentissage/Alternance'],
            Indeed: ['Apprentissage / Alternance'],
            Monster: ['Stage-Apprentissage-Alternance']
        }
    });
}
if (Contracts.find({
    name: 'Freelance'
}).count() === 0) {
    Contracts.insert({
        name: 'Freelance',
        websites: {
            Keljob: ['Indépendant / Freelance / Autoentrepreneur','Franchisé'],
            Monster: ['Indépendant-Freelance-Saisonnier-Franchise'],
            Remixjobs: ['Freelance'],
            Indeed: ['Freelance / Indépendant'],
            Cadremploi: ['Indépendant / Freelance', 'Franchises']
        }
    });
}