import { GameParams } from './game-params';
import { Deck } from '../cards/deck';
import { Meld } from '../cards/meld';
import { Card } from '../cards/card';
import { runFromObj } from '../cards/run-util';
import { AbstractGameState } from '../games/abstract-game-state';
import { HandlerData } from './handler-data';

/**
 * A class used to track the current state of the game
 */
export class GameState extends AbstractGameState<GameParams, GameState.State, HandlerData> {
    /**
     * The current round
     */
    public round: number = 0;

    /**
     * The scores of the hands
     */
    public points: number[];

    /**
     * This is where the three of a kind, four card runs are played for each of the hands
     */
    public played!: Meld[][];

    /**
     * The index of the dealer player
     */
    public dealer: number;

    /**
     * The index of the player who will be next
     */
    public whoseTurn!: number;

    public turnPayload: {discard: Card | null, played: Card[][][] | null} | undefined = undefined; // ReturnType<typeof Hand.turn>;

    public whoseAsk: number | undefined = undefined;

    /**
     * Create a new game state
     * @param numPlayers the number of players
     * @param gameParams the settings to use
     */
    constructor(numPlayers: number, gameParams: GameParams) {
        super(numPlayers, gameParams, GameState.State.START_GAME);
        this.points = new Array(numPlayers).fill(0, 0, numPlayers);
        this.dealer = 0;
        this.whoseTurn = 0;
        this.setupRound();
    }

    /**
     * Sets up the state for a new round
     */
    public setupRound() {
        this.hands = new Array(this.numPlayers).fill(0).map(() => []);
        this.played = new Array(this.numPlayers).fill(0).map(() => []);
        this.deck = new Deck(2, true);
    }

    /**
     * Returns the number to deal at the beginning for the current round
     */
    public getNumToDeal() {
        const roundNeeded = this.getRound().reduce((one, two) => one + two, 0);
        if (this.getRound() === this.gameParams.rounds[-1]) {
            return roundNeeded; // on the last hand, since there is no discard, deal one less
        }
        return roundNeeded + 1;
    }

    /**
     * Returns whether it is the last round
     * @todo consider renaming
     */
    public isLastRound() {
        return this.round === this.gameParams.rounds.length - 1;
    }

    /**
     * Advance to the next round
     */
    public nextRound() {
        this.round += 1;
        this.dealer = (this.dealer + 1) % this.numPlayers;
        return this.getRound();
    }

    /**
     * Return the current round
     */
    public getRound() {
        return this.gameParams.rounds[this.round];
    }

    public transformToHandlerData(position: number): HandlerData {
        // TODO is cloneDeep needed and should deepFreeze be used
        return {
            gameParams: GameParams.fromObj(this.gameParams),
            dealer: this.dealer,
            hand: this.hands[position].map(card => Card.fromObj(card)),
            numPlayers: this.numPlayers,
            played: this.played.map(runs => runs.map(run => runFromObj(run))),
            position,
            round: this.round,
            points: this.points.slice(),
            data: this.data[position]
        };
    }

    public static fromObj(obj: any) {
        // TODO better shape checking
        if(!(obj instanceof Object)) {
            throw new Error('Not an object');
        }
        if(!Array.isArray(obj.data) || !Array.isArray(obj.hands) || !Array.isArray(obj.names) || !Array.isArray(obj.played) || !Array.isArray(obj.scores)) {
            throw new Error('Shape of object is wrong');
        }
        const params = obj.gameParams;
        const state = new GameState(0, params);
        state.completed = obj.completed;
        state.data = obj.data;
        state.dealer = obj.dealer;
        state.deck = Deck.fromObj(obj.deck);
        state.hands = obj.hands.map((hand: Card[]) => hand.map(card => Card.fromObj(card)));
        state.names = obj.names;
        state.numPlayers = obj.numPlayers;
        state.played = obj.played.map((runs: Meld[]) => runs.map(run => runFromObj(run)));
        state.round = obj.round;
        state.points = obj.scores;
        state.state = obj.state;
        state.turnPayload = obj.turnPayload;
        state.whoseAsk = obj.whoseAsk;
        state.whoseTurn = obj.whoseTurn;

        return state;
    }
}

export namespace GameState {
    export enum State {
        START_GAME,

        START_ROUND,
        WAIT_FOR_TURN_PLAYER_WANT,
        HANDLE_TURN_PLAYER_WANT,

        WAIT_FOR_PLAYER_WANT,
        HANDLE_PLAYER_WANT,

        HANDLE_NO_PLAYER_WANT,

        START_TURN,
        WAIT_FOR_TURN,
        HANDLE_TURN,

        END_ROUND,

        END_GAME
    }
}