import {appendCSS, createModifiedEl, removeClassFn} from "../dom";

const style = require("../style.css");

const CLASS_PREFIX = "io-";

export const appendStyles = () => {
    appendCSS(style);
};

export const createEl = createModifiedEl((attr, val) => {
    if (attr === "className") {
        return val.split(" ").map((v) => CLASS_PREFIX + v).join(" ");
    }
});

export const removeClass = removeClassFn((cls) => CLASS_PREFIX + cls);

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
