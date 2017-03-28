$(document).ready(function() {
    apiUrl = 'https://omgvamp-hearthstone-v1.p.mashape.com/cards';

    function insertCards(cards) {
        // Array of available cards to play Hearthstone in standard mode
        var availableCards = [
            cards['Basic'],
            cards['Classic'],
            cards['Blackrock Mountain'],
            cards['Karazhan'],
            cards['Mean Streets of Gadgetzan'],
            cards['The Grand Tournament'],
            cards['The League of Explorers'],
            cards['Whispers of the Old Gods']
        ];
        $.each(availableCards, function(i, expansion) {
            $.each(expansion, function(index, card) {
                if (card.collectible === true && card.type !== 'Hero') {
                    var img = $('<img>', {
                        'src': card.img,
                        'name': card.name,
                        'cost': card.cost,
                        'rarity': card.rarity,
                        'data-id': card.cardId,
                        'data-click': 0
                    });
                    $('section').append(img);
                }
            });
        });
    }

    $.ajax({
        url: apiUrl,
        data: {
            'mashape-key':'tZrHcEahFumshpvjWN5LC8cxF6xep1RICQvjsngRF5TY2T7Ryv'
        }
    })
    .done(function(response) {
        insertCards(response);
        console.log("success");
    })
    .fail(function() {
        console.log("error");
    })
});
