i18n.map('fr', {
    public: {
        error: {
            scrapGeneral: '{$1} ne répond pas. La totalité des annonces n\'a pas pu être récupérée.',
            scrapNbOffers: '{$1} sur {$2} offres n\'ont pas pu être récupérées depuis le site {$3}.',
            apiGoogleNoReply: 'API de Google non fonctionnel - Recherche impossible.',
            apiGoogleNoMatch: 'La recherche ne fonctionne pas pour ce que vous avez recherché.',
            general: 'Une erreur est survenue, contactez l\'administrateur.',
        }
    },
    server: {
        error: {
            scrapUrlNoReply: 'Une URL de {$1} ne répond pas.',
            selectorsMissing: 'Veuillez remplir la liste des selectors pour le module: {$1}',
            selectorsExplanation: 'Erreur lors de l\'appel de getSelectors()',
            contractNotFound: 'Pas de correspondance - Le type de contract n\'est pas enregistré dans la base de données'
        }
    }
});