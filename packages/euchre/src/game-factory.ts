import { AbstractGameFactory, Handler, Intermediary } from "@cards-ts/core";
import { GameHandlerParams } from "./game-handler";
import { GameParams } from "./game-params";
import { GameSetup } from "./game-setup";
import { GameState } from "./game-state";
import { GameStateIterator } from "./game-state-iterator";
import { HandlerData } from "./handler-data";
import { HeuristicHandler } from "./handlers/heuristic-handler";
import { IntermediaryHandler } from "./handlers/intermediary-handler";
import { ResponseMessage } from "./messages/response-message";
import { ResponseValidator } from "./response-validator";
import { StateTransformer } from "./state-transformer";

export class GameFactory extends AbstractGameFactory<HandlerData, GameHandlerParams, GameParams, GameState.State, GameState, ResponseMessage, StateTransformer, ResponseValidator> {
    protected getGameStateIterator() {
        return new GameStateIterator();
    }

    getResponseValidator() {
        return new ResponseValidator();
    }

    getStateTransformer() {
        return new StateTransformer();
    }
    
    getGameSetup() {
        return new GameSetup();
    }

    getIntermediaryHandler(intermediary: Intermediary) {
        return new IntermediaryHandler(intermediary);
    }

    getDefaultBotHandler() {
        return new HeuristicHandler() as Handler<GameHandlerParams, HandlerData, ResponseMessage>;
    }
}