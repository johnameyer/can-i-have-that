export abstract class Controller<State> {
    state!: State;
    
    initialize(state: State) {
        this.state = state;
    }
}