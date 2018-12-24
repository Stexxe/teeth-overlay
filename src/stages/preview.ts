import {addEvent, appendChildren} from "../dom";
import {Mark} from "../Mark";
import {defineStage} from "../stage";
import {Dimension, Rect} from "../utils";
import {appendStyles, createEl, setRenderState} from "./common";

interface InputType {
    root: HTMLElement;
    image: HTMLImageElement;
    marks: Mark[];
}

type SourceTargetRect = [Rect, Rect];

interface StateType {
    image: HTMLImageElement;
    after: SourceTargetRect;
}

const beforeDimension = (image: HTMLImageElement, [left, middle]: number[]): Dimension => {
    return [middle, image.height];
};

const afterSourceTargetFn =
    ([left, middle, right]: number[], [w, h]: Dimension, gapPercent = 0.05) => (overlay: number): SourceTargetRect => {

    const hDelta = right - middle - left;
    const startX = middle + hDelta;
    const gapPx = gapPercent * middle;
    const width = w - startX;

    overlay = (overlay + 2 * gapPx > width ? width - 2 * gapPx : overlay);

    return [
        [startX + gapPx, 0, overlay, h],
        [gapPx, 0, overlay, h],
    ];
};


const renderState = (ctx: CanvasRenderingContext2D, {image, after}: StateType) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(image,
        0, 0, ctx.canvas.width, ctx.canvas.height,
        0, 0, ctx.canvas.width, ctx.canvas.height);

    const [[sx, sy, sw, sh], [tx, ty, tw, wh]] = after;
    ctx.drawImage(image, sx, sy, sw, sh, tx, ty, tw, wh);
};

export const previewStage = defineStage<InputType, any>(({root, image, marks}, pass) => {
    const marksX = marks.sort(([x1], [x2]) => x1 - x2).map(([x]) => x);
    const afterSourceTarget = afterSourceTargetFn(marksX, [image.width, image.height]);

    let state: StateType = {
        after: afterSourceTarget(0),
        image,
    };

    const makeOverlay = (overlay: number): StateType => {
        return setRenderState<StateType>(state, {after: afterSourceTarget(overlay)}, (s) => renderState(ctx, s));
    };

    appendStyles();

    const canvas = createEl("canvas") as HTMLCanvasElement;
    const rangeInput = createEl("input",
        {className: "slider", type: "range", min: "0", value: "0"},
    ) as HTMLInputElement;

    appendChildren(root, [
       canvas, createEl("div", {}, [rangeInput]),
    ]);

    addEvent(rangeInput, "input", (e) => {
        const overlayAmount = Number.parseFloat( (e.target as HTMLInputElement).value );
        makeOverlay(overlayAmount);
    });

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const [width, height] = beforeDimension(image, marksX);
    canvas.width = width;
    canvas.height = height;

    rangeInput.max = width.toString();
    rangeInput.style.width = `${canvas.offsetWidth}px`;

    makeOverlay(0);
});
