import { Controller } from "./controller";

interface ScoreState {
    scores: number[];
}

export class ScoreController extends Controller<ScoreState> {
    increaseScore(player: number, increment: number) {
        this.state.scores[player] += increment;
    }
}