import { Card } from '../cards/card';
import { Deck } from '../cards/deck';
import { GenericGameState } from './generic-game-state';
import { Message } from '../messages/message';

/**
 * Abstract class for transforming a game's state into various forms
 */
export abstract class AbstractStateTransformer<GameParams, State, HandlerData, GameState extends GenericGameState<GameParams, State>, ResponseMessage extends Message> {

    /**
     * Initializes a new game state
     * @param gameParams the parameters to use
     * @param names the names of the players
     * @param initialState the initial state of the state machine 
     */
    initialState({gameParams, names, initialState}: {gameParams: GameParams; names: string[]; initialState?: State}): GameState {
        return {
            gameParams,
            numPlayers: names.length,
            names,
            completed: false,
            data: names.map(() => ({})),
            hands: names.map(() => []),
            state: initialState,
        } as any as GameState;
    }

    /**
     * Deserialize the game state from a string
     * @param str the string to load from
     */
    fromStr(str: string): GameState {
        const obj = JSON.parse(str);
        // TODO better shape checking
        if(!(obj instanceof Object)) {
            throw new Error('Not an object');
        }
        if(!Array.isArray(obj.data) || !Array.isArray(obj.hands) || !Array.isArray(obj.names)) {
            throw new Error('Shape of object is wrong');
        }

        return {
            gameParams: obj.gameParams,
            completed: obj.completed,
            data: obj.data,
            deck: obj.deck ? Deck.fromObj(obj.deck) : undefined,
            hands: obj.hands.map((hand: Card[]) => hand.map(card => Card.fromObj(card))),
            names: obj.names,
            numPlayers: obj.numPlayers,
            state: obj.state,
        } as GameState;
    }

    /**
     * Serialize the state to a string
     * @param state the state to serialize
     */
    toString(state: GameState) {
        return JSON.stringify(state);
    }

    /**
     * Convert the state into a form for the handlers
     */
    abstract transformToHandlerData(gameState: GameState, position: number): HandlerData;

    /**
     * Consolidate an incoming event with the game state
     * @param gameState the current state
     * @param sourceHandler the handler or player generating the event
     * @param incomingEvent the changing event
     */
    abstract merge(gameState: GameState, sourceHandler: number, incomingEvent: ResponseMessage): GameState;
}
