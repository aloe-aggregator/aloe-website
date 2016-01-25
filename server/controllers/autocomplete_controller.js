Meteor.methods({
    /**
     * return an autocomplete list of the keyword input
     * limited by 5 results and if the keyword is in the
     * 75% more used keyword
     * @param  {String} string to autocomplete
     * @return {List[String]|null}
     */
    autocompleteKeywordInput: function(keyword) {
        listAutocomplete = new Array();
        KeywordAutocomplete.find({
            keyword: new RegExp("^" + keyword.toLowerCase()),
            displayable: 1
        }, {
            sort: {
                relevance: -1
            },
            limit: 5
        }).forEach(function(keywordObject) {
            listAutocomplete.push(keywordObject.keyword);
        });
        return listAutocomplete;
    },

    /**
     * add to the keywordAutocomplete collection each word of
     * the user search who is an alphanumeric word
     * if the keyword is already present, the relevance is
     * incremented by 1
     * Update the displayable input if the keyword is in the 75% more common word
     * @param {String} the keyword search
     */
    addAutocompleteKeyword: function(keywords) {
        var words = replaceSpec(keywords).split(" ");
        var alphanumeric = new RegExp("^[a-zA-Z0-9]*$");
        var numeric = new RegExp("^[0-9]*$");
        var calculationDisplayable = false;

        // Add word to the collection
        _.map(words, function(word) {
            if (word.length >= 3) {
                if (alphanumeric.test(word) && !numeric.test(word)) {
                    calculationDisplayable = true;
                    var exist = KeywordAutocomplete.find({
                        keyword: word
                    }).count();
                    if (exist === 0) {
                        var keywordObject = new Object();
                        keywordObject.keyword = word.toLowerCase();
                        keywordObject.relevance = 1;
                        keywordObject.displayable = 0;
                        KeywordAutocomplete.insert(keywordObject);
                    } else {
                        KeywordAutocomplete.update({
                            keyword: word
                        }, {
                            $inc: {
                                relevance: +1
                            }
                        });
                    }
                }
            }
        });
        // Calculation if the input is displayable
        if (calculationDisplayable) {
            var keywordsSize = KeywordAutocomplete.find().count();
            var thirdQuartile = Math.ceil((3 * keywordsSize) / 4);
            var keywordsList = KeywordAutocomplete.find({}, {
                sort: {
                    relevance: -1
                }
            }).fetch();
            var thirdQuartileRelevance = keywordsList[thirdQuartile - 1].relevance;
            KeywordAutocomplete.update({
                relevance: {
                    $gt: thirdQuartileRelevance
                }
            }, {
                $set: {
                    displayable: 1
                }
            }, {
                multi: true
            });
            KeywordAutocomplete.update({
                relevance: {
                    $lte: thirdQuartileRelevance
                }
            }, {
                $set: {
                    displayable: 0
                }
            }, {
                multi: true
            });
        }
    }
});