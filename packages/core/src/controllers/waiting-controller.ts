import { Controller } from "./controller";

interface WaitingState {
    /**
     * Field indicating who the game is waiting on, whether it be a number of players or some specific players (by position)
     */
    waiting: number | number[];

    /**
     * Field indicating which of the hands have already responded
     */
    responded: boolean[];
}

export class WaitingController extends Controller<WaitingState> {

}