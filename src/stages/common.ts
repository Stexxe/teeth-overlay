import {appendCSS, createModifiedEl} from "../dom";

const style = require("../style.css");

export const appendStyles = () => {
    appendCSS(style);
};

export const createEl = createModifiedEl((attr, val) => {
    if (attr === "className" || attr === "id") { return "io-" + val; }
});

type PartialState<T> = { [key in keyof T]?: T[key] };
type RenderFn<T> = (state: T) => void;

export function setRenderState<StateT>(state: StateT, val: PartialState<StateT>, renderFn: RenderFn<StateT>): StateT {
    const result = setState(state, val);
    renderFn(result);
    return result;
}

export function setState<StateT>(state: StateT, val: PartialState<StateT>) {
    return {
        ...state,
        ...val,
    };
}
