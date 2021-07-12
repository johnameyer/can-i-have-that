import { Message } from "../games/message";
import { Controller } from "./controller";

interface NamesState {
    names: ReadonlyArray<string>;
}

export class NamesController extends Controller<NamesState> {
}