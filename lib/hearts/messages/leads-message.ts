import { Message } from "../../games/message";
import { Serializable } from "../../intermediary/presenter";

function generateMessage(leader: string): Serializable[] {
    return [leader, 'leads next trick'];
}

/**
 * Class that denotes to a handler that they have been dealt or drawn a card
 */
export class LeadsMessage extends Message {
    /**
     * @param leader the hand that is leading
     */
    constructor(public readonly leader: string) {
        super(generateMessage(leader));
    }
}