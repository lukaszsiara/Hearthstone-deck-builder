$(document).ready(function() {
    var apiUrl = 'https://omgvamp-hearthstone-v1.p.mashape.com/cards';
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

    $('.neutral-button').html('<img src="images/Neutralicon.png"><p>Neutral</p>');
    $('.app').hide();
    $('.neutral-cards').addClass('active');
    $.each(characterClasses, function(i, character) {
        var heroClass = $('<div>');
        heroClass.css('background-image', 'url("images/' + character + '.png")')
        .attr('hero', character);
        heroClass.appendTo('.heroes');
    });

    var hero = '';
    $('.heroes').on('click', 'div', function(event) {
        hero = $(this).attr('hero');
        $('.hero-button').html('<img src="images/' + hero + 'icon.png"><p>' + hero + '</p>');
        $('.heroes').hide();
        $('h1').hide();
        $('.hero-cards').hide();
        $('.app').show();
        loadHeroCards(hero);
    });
    loadNeutralCards();

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
        var imgs = $('section img');
        imgs.sort(function(a, b) {
            var cardA = parseInt($(a).attr('cost'));
            var cardB = parseInt($(b).attr('cost'));
            return (cardA < cardB) ? -1 : (cardA > cardB) ? 1 : 0;
        });
        $('section .neutral-cards').html(imgs);
    }
    function sortList() {
        var listEls = $('.cardlist li');
        listEls.sort(function(a, b) {
            var spanA = parseInt($(a).attr('cost'));
            var spanB = parseInt($(b).attr('cost'));
            return (spanA < spanB) ? -1 : (spanA > spanB) ? 1 : 0;
        })
        $('.cardlist').html(listEls);
    }

    function loadHeroCards(heroclass) {
        $.getJSON(apiUrl + '/classes/' + heroclass,
        {'mashape-key':'tZrHcEahFumshpvjWN5LC8cxF6xep1RICQvjsngRF5TY2T7Ryv'}, function(card, textStatus) {
            insertHeroCards(card);
        });
    }
    function loadNeutralCards() {
        $.getJSON(apiUrl,
        {'mashape-key':'tZrHcEahFumshpvjWN5LC8cxF6xep1RICQvjsngRF5TY2T7Ryv'}, function(card, textStatus) {
            insertNeutralCards(card);
        });
    }


    var cardCounter = 0;
    // Adding cards to the list
    $('section').on('click', 'img', function() {
        var card = $(this);
        var cardName = $(this).attr('name');
        var cardRarity = $(this).attr('rarity');
        var cardId = $(this).attr('data-id');
        var manacost = $(this).attr('cost');
        var clickNum = parseInt($(this).attr('data-click'));

        $.each($('.cardlist li'), function(index, el) {
            if ($(this).attr('data-id') === cardId && clickNum === 1 && cardRarity!== 'Legendary' && cardCounter < 30) {
                $(this).find('span.quantity').text(' x 2');
                $(this).attr('data-click', 2);
                card.css('opacity', '0.5');
                clickNum++;
                if (manacost > 7) {
                    var manaCount = parseInt($('.mana-count7').text());
                    manaCount++;
                    $('.mana-count7').text(manaCount);
                } else {
                    var manaCount = parseInt($('.mana-count' + manacost).text());
                    manaCount++;
                    $('.mana-count'+ manacost).text(manaCount);
                }
                increaseDataCount($(this));
                progressBar();
                return false;
            }
        });
        if (clickNum < 1 && cardRarity !== 'Legendary'  && cardCounter < 30) {
            clickNum++;
            var li = $('<li>');
            li.attr('data-id', cardId)
            .addClass(cardRarity)
            .attr('cost', manacost)
            .attr('data-click', clickNum)
            .html('<span class="mana-cost"> ' + manacost + ' </span>' + cardName + '<span class="quantity"> x 1</span>');
            li.appendTo('.cardlist');
            if (manacost > 7) {
                var manaCount = parseInt($('.mana-count7').text());
                manaCount++;
                $('.mana-count7').text(manaCount);
            } else {
                var manaCount = parseInt($('.mana-count' + manacost).text());
                manaCount++;
                $('.mana-count'+ manacost).text(manaCount);
            }
            increaseDataCount($(this));
            progressBar();
            sortList();
        } else if (cardRarity === 'Legendary' && clickNum < 1  && cardCounter < 30) {
            clickNum++;
            card.css('opacity', '0.5');
            var span = $('<span> x 1</span>').addClass('quantity');
            var li = $('<li>').text(cardName);
            li.addClass(cardRarity)
            .attr('data-id', cardId)
            .attr('cost', manacost)
            .attr('data-click', clickNum)
            .html('<span class="mana-cost"> ' + manacost + ' </span>' + cardName + '<span class="quantity"> x 1</span>');;
            li.appendTo('.cardlist');
            if (manacost > 7) {
                var manaCount = parseInt($('.mana-count7').text());
                manaCount++;
                $('.mana-count7').text(manaCount);
            } else {
                var manaCount = parseInt($('.mana-count' + manacost).text());
                manaCount++;
                $('.mana-count'+ manacost).text(manaCount);
            }
            increaseDataCount($(this));
            progressBar();
            sortList();
        }
        $(this).attr('data-click', clickNum);
        cardCounter = 0;
        countCards();
    });

    // Removing cards from the list
    $('.cardlist').on('click', 'li', function() {
        var listElem = $(this);
        var manacost = $(this).attr('cost');
        if ($(this).hasClass('Legendary')) {
            var id = $(this).attr('data-id');
            decreaseDataCount(listElem);
            progressBar();
            if (manacost > 7) {
                var manaCount = parseInt($('.mana-count7').text());
                manaCount--;
                $('.mana-count7').text(manaCount);
            } else {
                var manaCount = parseInt($('.mana-count' + manacost).text());
                manaCount--;
                $('.mana-count'+ manacost).text(manaCount);
            }
            $(this).remove();
            $.each($('section img'), function(index, el) {
                if ($(this).attr('data-id') === id) {
                    $(this).attr('data-click', 0);
                    $(this).css('opacity', '1');
                }
            });
        } else {
            if ($(this).attr('data-click') == 2) {
                var id = $(this).attr('data-id');
                $(this).find('span.quantity').text(' x 1');
                if (manacost > 7) {
                    var manaCount = parseInt($('.mana-count7').text());
                    manaCount--;
                    $('.mana-count7').text(manaCount);
                } else {
                    var manaCount = parseInt($('.mana-count' + manacost).text());
                    manaCount--;
                    $('.mana-count'+ manacost).text(manaCount);
                }
                $.each($('section img'), function(index, el) {
                    if ($(this).attr('data-id') === id) {
                        $(this).attr('data-click', 1);
                        $(this).css('opacity', '1');
                    }
                });
                decreaseDataCount(listElem);
                progressBar();
                $(this).attr('data-click', 1);
            } else if ($(this).attr('data-click') == 1) {
                var id = $(this).attr('data-id');
                if (manacost > 7) {
                    var manaCount = parseInt($('.mana-count7').text());
                    manaCount--;
                    $('.mana-count7').text(manaCount);
                } else {
                    var manaCount = parseInt($('.mana-count' + manacost).text());
                    manaCount--;
                    $('.mana-count'+ manacost).text(manaCount);
                }
                $.each($('section img'), function(index, el) {
                    if ($(this).attr('data-id') === id) {
                        $(this).attr('data-click', 0);
                    }
                });
                decreaseDataCount(listElem);
                progressBar();
                $(this).remove();
            }
        }
        cardCounter = 0;
        countCards();
    });

    // Events for switching beetwen hero and class cards
    $('.hero-button').on('click', function() {
        $('.neutral-cards').hide().removeClass('active');
        $('.hero-cards').show();
        $('.hero-cards').addClass('active');
    });
    $('.neutral-button').on('click', function() {
        $('.hero-cards').hide().removeClass('active');
        $('.neutral-cards').show();
        $('.neutral-cards').addClass('active');
    });

    // Loop for creating mana bars
    for (var i = 0; i < 8; i++) {
        var div = $('<div>').addClass('bar-wrap');
        var bar = $('<div>').addClass('mana cost' + i)
        .attr('data-count', 0);
        var crystal = $('<p>' + i + '</p>').addClass('crystal');
        var cardCounter = $('<p>0</p>').addClass('mana-count' + i);
        div.appendTo('.mana-graph');
        crystal.appendTo(div);
        cardCounter.prependTo(div);
        bar.appendTo(div);
    }
    $('.crystal').eq(7).text('7+');

    function increaseDataCount(element) {
        var click = parseInt(element.attr('data-click'));
        var cost = parseInt(element.attr('cost'));
        if (cost > 7) {
            cost = 7;
        }
        var count = $('.cost' + cost).attr('data-count');
        count++;
        $('.cost' + cost).attr('data-count', count);
    }
    function decreaseDataCount(element) {
        var click = parseInt(element.attr('data-click'));
        var cost = parseInt(element.attr('cost'));
        if (cost > 7) {
            cost = 7;
        }
        var count = $('.cost' + cost).attr('data-count');
        count--;
        $('.cost' + cost).attr('data-count', count);
    }
    function progressBar() {
        var max = 0;
        $.each($('.mana-graph .mana'), function(index, el) {
            if (parseInt($(this).attr('data-count')) > max) {
                max = parseInt($(this).attr('data-count'));
            }
        });
        $.each($('.mana-graph .mana'), function(index, el) {
            var bar = parseInt($(this).attr('data-count'));
            if (max == 0) {
                $(this).css('height', '0');
            } else {
                var height = bar / max * 100 + '%';
                $(this).css('height', height);
            }
        });
    }
    function countCards() {
        $.each($('.cardlist').find('li'), function(index, el) {
            cardCounter += parseInt($(this).attr('data-click'));
        });
        $('.card-counter').text(cardCounter + '/30 cards');
    }

    var heroCardsPosition = 0;
    var neutralCardsPosition = 0;
    // Event responisble for moving card pages
    $('.next').on('click', function(event) {
        var heroLen = $('.hero-cards img').length;
        var heropagesNum = 0;
        if (heroLen % 15 == 0) {
            heropagesNum = heroLen / 15 - 1;
        } else {
            heropagesNum = Math.floor(heroLen / 15);
        }
        var neutralLen = $('.neutral-cards img').length;
        var neutralpagesNum = 0;
        if (neutralLen % 15 == 0) {
            neutralpagesNum = neutralLen / 15 - 1;
        } else {
            neutralpagesNum = Math.floor(neutralLen / 15);
        }
        if ($('.hero-cards').hasClass('active') && heroCardsPosition > -heropagesNum * 636) {
            heroCardsPosition -= 636;
            $('.hero-cards').css('top', heroCardsPosition + 'px');
        } else if ($('.neutral-cards').hasClass('active') && neutralCardsPosition > -neutralpagesNum * 636) {
            neutralCardsPosition -= 636;
            $('.neutral-cards').css('top', neutralCardsPosition + 'px');
        }
    });
    $('.prev').on('click', function(event) {
        if ($('.hero-cards').hasClass('active') && heroCardsPosition < 0) {
            heroCardsPosition += 636;
            $('.hero-cards').css('top', heroCardsPosition + 'px');
        } else if ($('.neutral-cards').hasClass('active') && neutralCardsPosition < 0) {
            neutralCardsPosition += 636;
            $('.neutral-cards').css('top', neutralCardsPosition + 'px');
        }
    });
});
