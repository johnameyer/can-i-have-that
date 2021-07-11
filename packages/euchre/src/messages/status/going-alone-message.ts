import { Card, Message } from "@cards-ts/core";
import { Serializable } from "@cards-ts/core";

function generateMessage(player: string): Serializable[] {
    return [player, 'is going alone'];
}

/**
 * Class that denotes to a handler that a player is going alone
 */
export class GoingAloneMessage extends Message {

    public readonly type = 'going-alone-message';

    /**
     * @param player the player going alone
     */
    constructor(public readonly player: string) {
        super(generateMessage(player));
    }
}