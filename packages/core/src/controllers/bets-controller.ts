import { Serializable } from "../intermediary/presenter";
import { Controller } from "./controller";

interface BetsState {
    bets: number[];
}

export class BetsController extends Controller<BetsState> {
    increaseBet(player: number, increment: number) {
        this.state.bets[player] += increment;
    }
}