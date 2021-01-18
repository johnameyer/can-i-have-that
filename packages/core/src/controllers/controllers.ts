import { Controller } from "./controller";
import { ParamsController, ParamsState } from "./params-controller";

export type Controllers = {
    [key: string]: Controller<unknown>
}

type ControllerMapping<T> = {
    [key in keyof T]: T[key] extends new (state: any) => infer Controller ? Controller : never
}

type ControllerStateMapping<T> = {
    [key in keyof T]: T[key] extends new (state: any) => Controller<infer State> ? State : never
}