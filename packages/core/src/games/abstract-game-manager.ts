import { GenericHandler, GenericGameState, Message, GenericResponseValidator, GenericGameStateIterator } from "..";
import { Intermediary } from "../intermediary/intermediary";
import { AbstractStateTransformer } from "./abstract-state-transformer";
import { GameDriver } from "./game-driver";

export abstract class AbstractGameManager<HandlerData, Handler extends GenericHandler<HandlerData, ResponseMessage>, GameParams, State, GameState extends GenericGameState<GameParams, State>, ResponseMessage extends Message, StateTransformer extends AbstractStateTransformer<GameParams, State, HandlerData, GameState, ResponseMessage>, ResponseValidator extends GenericResponseValidator<GameParams, State, GameState, ResponseMessage>> {
    private state!: any;
    private driver!: GameDriver<HandlerData, Handler, GameParams, State, GameState, ResponseMessage, StateTransformer, ResponseValidator>;

    abstract getDefaultBotHandler(): new () => Handler;
    abstract getStateTransformer(): StateTransformer;
    abstract getResponseValidator(): ResponseValidator;
    abstract getGameStateIterator(): GenericGameStateIterator<HandlerData, ResponseMessage, Handler, GameParams, State, GameState, StateTransformer>;
    abstract getDefaultParams(): GameParams;

    initializeState() {
        const names = ['Jeff', 'Greg', 'Belle', 'Smithy'];

        this.state = this.getStateTransformer().initialState({ names: names, gameParams: this.getDefaultParams() });
    }

    
    setup() {
        // const handler = new IntermediaryHandler();

        const players = Array(4);
        players[0] = handler;
        for(let i = 1; i < players.length; i++) {
            players[i] = new (this.getDefaultBotHandler())();
        }

        if(!this.state) {
            this.initializeState();
        }

        this.driver = new GameDriver(players, this.state, this.getGameStateIterator(), this.getStateTransformer(), this.getResponseValidator());
    }

    
    handleEvent(sourceHandler: number, incomingEvent: Event) {
        // Check the event
        const validatedEvent = this.getResponseValidator().validate(this.state, sourceHandler, incomingEvent);
        
        if(!validatedEvent) {
            throw new Error('Received invalid event: ' + JSON.stringify(incomingEvent));
        }

        // Merge the data from the event
        this.state = this.getStateTransformer().merge(this.state, sourceHandler, validatedEvent);
        
        this.driver.gameState = this.state;
    }

    async startAsync() {
        this.setup();

        await this.driver.start();
    }
    
    startSync() {
        this.setup();

        do {
            // Play through all of synchronous actions
            this.driver.resume();
            
            this.driver.handleSyncResponses();
        } while (!this.driver.isWaitingOnPlayerSubset([0]));

        this.state = this.driver.gameState;
    }

    async handleOutgoing() {
        // Make sure all the outgoing data goes out
        await this.driver.handleOutgoing();
    }

    stateToString() {
        return this.getStateTransformer().toString(this.state);
    }
}