import { Controller } from "./controller";

export interface ParamsState<GameParams> {
    /**
     * The settings that a game runs under
     */
    readonly gameParams: GameParams;
}

export class ParamsController<GameParams> extends Controller<ParamsState<GameParams>> {
    getParams(): Readonly<GameParams> {
        return this.state.gameParams;
    }
}