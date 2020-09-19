import { Card } from "../../cards/card";
import { Message } from "../../games/message";
import { Serializable } from "../../intermediary/presenter";

function generateMessage(card: Card, extra?: Card): Serializable[] {
    if (extra) {
        return ['Picked up', card, 'and', extra];
    } else {
        return ['Picked up', card];
    }
}

/**
 * Class that denotes to a handler that they have been dealt or drawn a card
 */
export class DealMessage extends Message {
    /**
     * @param card the card being received
     * @param extra the extra card that is drawn if applicable
     * @param dealt whether or not the card was dealt
     */
    constructor(public readonly card: Card, public readonly extra?: Card) {
        super(generateMessage(card, extra));
    }
}