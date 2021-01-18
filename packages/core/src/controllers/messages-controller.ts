import { Message } from "../games/message";
import { Controller } from "./controller";

interface MessagesState {
    messages: Message[];
}

export class MessagesController extends Controller<MessagesState> {
    appendMessage(message: Message) {
        this.state.messages.push(message);
    }
}