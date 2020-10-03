import { Message } from "./message";

/**
 * Actor that views game state but is not involved
 */
export interface Observer<HandlerData>  {
    /**
     * Allows the player to be informed of changes in the game state
     * @param bundle the incoming message
     * @returns a promise that resolves once the notification is delivered (at least to another service) 
     */
    message(gameState: HandlerData, bundle: Message): void | Promise<void>;

    /**
     * Notifies the player that we are waiting for another player to make their move
     * @param who who we are waiting for, or undefined if no one currently
     * @returns a promise that resolves once the notification is delivered (at least to another service)
     */
    waitingFor(gameState: HandlerData, who: string[] | undefined): void | Promise<void>;
}