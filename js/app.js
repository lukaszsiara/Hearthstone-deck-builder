$(document).ready(function() {
    apiUrl = 'https://omgvamp-hearthstone-v1.p.mashape.com/cards';

    var characterClasses = [
        'Druid',
        'Hunter',
        'Mage',
        'Paladin',
        'Priest',
        'Rogue',
        'Shaman',
        'Warlock',
        'Warrior'
    ];

    $.each(characterClasses, function(i, character) {
        var div = $('<div>');
        div.addClass('img')
        .attr('hero', character)
        .css('background-image', 'url(images/' + character + '.jpg' + ')');
        div.appendTo('.heroes');
    });
    var hero = '';
    $('.heroes').on('click', 'div', function(event) {
        hero = $(this).attr('hero');
        $('.heroes').hide();
        loadHeroCards(hero);
        loadNeutralCards(hero);
    });

    function insertNeutralCards(cards) {
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
                if (card.collectible === true && card.type !== 'Hero' && card.playerClass === 'Neutral') {
                    var img = $('<img>', {
                        'src': card.img,
                        'name': card.name,
                        'cost': card.cost,
                        'rarity': card.rarity,
                        'data-id': card.cardId,
                        'data-click': 0
                    });
                    $('section .neutral-cards').append(img);
                }
            });
        });
        sortCards();
    }
    function insertHeroCards(cards) {
        $.each(cards, function(i, card) {
            if (card.collectible === true && card.type !== 'Hero' && card.cardSet !== 'Naxxramas' && card.cardSet !== 'Goblins vs Gnomes') {
                var img = $('<img>', {
                    'src': card.img,
                    'name': card.name,
                    'cost': card.cost,
                    'rarity': card.rarity,
                    'data-id': card.cardId,
                    'data-click': 0
                });
                $('section .hero-cards').append(img);
            }
        });
    }

    function sortCards() {
        var imgs = $('img');
        imgs.sort(function(a, b) {
            var cardA = parseInt($(a).attr('cost'));
            var cardB = parseInt($(b).attr('cost'));
            return (cardA < cardB) ? -1 : (cardA > cardB) ? 1 : 0;
        });
        $('section .neutral-cards').html(imgs);
    }

    function loadHeroCards(heroclass) {
        $.getJSON(apiUrl + '/classes/' + heroclass,
        {'mashape-key':'tZrHcEahFumshpvjWN5LC8cxF6xep1RICQvjsngRF5TY2T7Ryv'}, function(card, textStatus) {
                insertHeroCards(card);
        });
    }
    function loadNeutralCards(neutralcards) {
        $.getJSON(apiUrl,
        {'mashape-key':'tZrHcEahFumshpvjWN5LC8cxF6xep1RICQvjsngRF5TY2T7Ryv'}, function(card, textStatus) {
                insertNeutralCards(card);
        });
    }


    $('section').on('click', 'img', function() {
        var card = $(this);
        var cardName = $(this).attr('name');
        var cardRarity = $(this).attr('rarity');
        var cardId = $(this).attr('data-id');
        var clickNum = parseInt($(this).attr('data-click'));

        $.each($('.cardlist li'), function(index, el) {
            if ($(this).attr('data-id') === cardId && clickNum === 1 && cardRarity!== 'Legendary') {
                $(this).find('span').text(' x 2');
                $(this).attr('data-click', 1);
                clickNum++;
                return false;
            }
        });
        if (clickNum < 1 && cardRarity !== 'Legendary') {
            clickNum++;
            var span = $('<span> x 1</span>');
            var li = $('<li>').text(cardName);
            li.attr('data-id', cardId)
            .addClass(cardRarity)
            .attr('data-click', clickNum);
            li.append(span);
            li.appendTo('.cardlist');
        } else if (cardRarity === 'Legendary' && clickNum < 1) {
            clickNum++;
            var span = $('<span> x 1</span>');
            var li = $('<li>').text(cardName);
            li.addClass(cardRarity)
            .attr('data-id', cardId);
            li.append(span);
            li.appendTo('.cardlist');
        }
        $(this).attr('data-click', clickNum);
    });

    $('.cardlist').on('click', 'li', function() {
        if ($(this).hasClass('Legendary')) {
            var id = $(this).attr('data-id');
            $(this).remove();
            $.each($('section img'), function(index, el) {
                if ($(this).attr('data-id') === id) {
                    $(this).attr('data-click', 0);
                }
            });
        } else {
            if ($(this).attr('data-click') == 1) {
                var id = $(this).attr('data-id');
                $(this).find('span').text(' x 1');
                $.each($('section img'), function(index, el) {
                    if ($(this).attr('data-id') === id) {
                        $(this).attr('data-click', 1);
                    }
                });
                $(this).attr('data-click', 0);
            } else if ($(this).attr('data-click') == 0){
                var id = $(this).attr('data-id');
                $.each($('section img'), function(index, el) {
                    if ($(this).attr('data-id') === id) {
                        $(this).attr('data-click', 0);
                    }
                });
                $(this).remove();
            }
        }
    });


});
