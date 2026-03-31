export const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const suits = ['♠', '♦', '♣', '♥'];

export interface Card {
    value: string;
    closed: boolean;
}

export function cardDeck(): Card[] {
    const cards: Card[] = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            cards.push({ value: suit + rank, closed: true });
        }
    }
    return shuffle(cards);
}

export function isRed(card: Card): boolean {
    return card.value.includes(suits[1]) || card.value.includes(suits[3]);
}

export function isAce(card: Card): boolean {
    return card.value.includes(ranks[0]);
}

export function isKing(card: Card): boolean {
    return card.value.includes(ranks[12]);
}

export function isOneRankHigher(card: Card, second: Card) {
    if (isKing(second)) {
        return false;
    }
    const rankSecond = second.value.substring(1)
    return card.value.substring(1) == ranks[ranks.indexOf(rankSecond) + 1];
}

export function suitIsSame(card: Card, second: Card) {
    return card.value.substring(0, 1) === second.value.substring(0, 1);
}

function shuffle(array: Card[]): Card[] {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}