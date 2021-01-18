import { Deck } from "../cards/deck";
import { Controller } from "./controller";

interface DeckState {
    deck: Deck;
}

export class DeckController extends Controller<DeckState> {
    get() {
        return this.state.deck;
    }
}