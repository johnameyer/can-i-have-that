import { Handler, HandlerAction } from "@cards-ts/core";
import { HandlerData } from "./handler-data";
import { DataResponseMessage, PassResponseMessage, TurnResponseMessage } from "./messages/response";
import { ResponseMessage } from "./messages/response-message";

export abstract class GameHandler implements Handler<'pass' | 'turn', HandlerData, ResponseMessage> {
    canHandle(key: any): key is ('pass' | 'turn') {
       return key === 'pass' || key == 'turn';
    }

    abstract pass: HandlerAction<HandlerData, DataResponseMessage | PassResponseMessage>;

    abstract turn: HandlerAction<HandlerData, DataResponseMessage | TurnResponseMessage>;
}