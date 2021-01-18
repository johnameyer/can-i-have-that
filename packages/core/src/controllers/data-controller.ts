import { Serializable } from "../intermediary/presenter";
import { Controller } from "./controller";

interface DataState {
    data: Serializable[];
}

export class DataController extends Controller<DataState> {
    getDataFor(handler: number) {
        return this.state.data[handler];
    }

    setDataFor(handler: number, value: Serializable) {
        this.state.data[handler] = value;
    }
}