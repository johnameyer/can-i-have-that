import { Controller } from "./controller";

interface GameState<Enum extends number> {
    gameState: Enum;
}

export class GameStateController<Enum extends number> extends Controller<GameState<Enum>> {
    get() {
        return this.state.gameState;
    }
}