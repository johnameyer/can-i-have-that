import { Serializable } from "../intermediary/presenter";

const isDefined = function<T>(t: T | undefined): t is T {
    return t !== undefined;
}

/**
 * Parent class for any message to be delivered to handlers
 */
export class Message {
    /**
     * @param components the pieces a message could be made of
     */
    constructor(public readonly components: Serializable[]) { }
}

export namespace Message {
    export type Transformer = (components: Serializable[], separator?: string) => string;

    export const defaultTransformer: Transformer = (components: Serializable[], joiner = ' ') => components.map(component => {
        if(component === undefined) {
            return undefined;
        }
        // @ts-ignore
        if(component.map) {
            // @ts-ignore
            return defaultTransformer(component, ', ');
        }
        return component.toString();
    }).filter(isDefined).reduce((a: string, b: string) => a + joiner + b);
}