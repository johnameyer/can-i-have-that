import { Message } from "../messages/message";
import { Handler, HandlerAction } from "./handler";

export type MessageHandlerParams = {
   message: [Message]
}

/**
 * Interface to listen for message events
 */
export abstract class MessageHandler<HandlerData, ResponseMessage extends Message> implements Handler<MessageHandlerParams, HandlerData, ResponseMessage> {
   canHandle(key: any): key is 'message' {
      return key === 'message';
   }
   
   /**
    * Sends a message to the handler
    */
   abstract message: HandlerAction<HandlerData, ResponseMessage, [Message]>;
}