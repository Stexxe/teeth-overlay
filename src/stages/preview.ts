import {addEvent, appendChildren} from "../dom";
import {Mark} from "../Mark";
import {Point} from "../Point";
import {defineStage} from "../stage";
import {animate, Dimension, Rect} from "../utils";
import {appendStyles, createEl, removeClass, setRenderState} from "./common";

interface InputType {
    root: HTMLElement;
    maxHeight: number;
    image: HTMLImageElement;
    marks: Mark[];
}

type SourceTargetRect = [Rect, Rect];

interface StateType {
    image: HTMLImageElement;
    after: SourceTargetRect;
    loading: [Point, Point];
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


const renderLoading = (ctx: CanvasRenderingContext2D, [fx, fy]: Point, [tx, ty]: Point) => {
    ctx.save();
    ctx.strokeStyle = "#00ffff";
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.restore();
};

const renderState = (ctx: CanvasRenderingContext2D, {image, after, loading: [from, to]}: StateType) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(image,
        0, 0, ctx.canvas.width, ctx.canvas.height,
        0, 0, ctx.canvas.width, ctx.canvas.height);

    const [[sx, sy, sw, sh], [tx, ty, tw, wh]] = after;
    ctx.drawImage(image, sx, sy, sw, sh, tx, ty, tw, wh);
    renderLoading(ctx, from, to);
};

export const previewStage = defineStage<InputType, any>(({root, image, marks, maxHeight}) => {
    const marksX = marks.sort(([x1], [x2]) => x1 - x2).map(([x]) => x);
    const afterSourceTarget = afterSourceTargetFn(marksX, [image.width, image.height]);

    const makeOverlay = (overlay: number): StateType => {
        return setRenderState<StateType>(state, {after: afterSourceTarget(overlay)}, (s) => renderState(ctx, s));
    };

    appendStyles();

    const canvas = createEl("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const rangeInput = createEl("input",
        {className: "slider hidden", type: "range", min: "0", value: "0"},
    ) as HTMLInputElement;

    appendChildren(root, [
       canvas, createEl("div", {}, [rangeInput]),
    ]);

    addEvent(rangeInput, "input", (e) => {
        const overlayAmount = Number.parseFloat( (e.target as HTMLInputElement).value );
        makeOverlay(overlayAmount);
    });

    [canvas.width, canvas.height] = beforeDimension(image, marksX);
    canvas.style.height = `${maxHeight}px`;

    let state: StateType = {
        after: afterSourceTarget(0),
        image,
        loading: [[0, 0], [canvas.width, 0]],
    };

    rangeInput.max = canvas.width.toString();
    rangeInput.style.width = `${canvas.offsetWidth}px`;

    animate((elapsed, totalTime) => {
        const [[fx, fy], [tx, ty]] = state.loading;
        const speed = canvas.height / totalTime;
        const nextY = fy + elapsed * speed;

        state = setRenderState(state, {
            loading: [[fx, nextY], [tx, nextY]],
        }, (s) => renderState(ctx, s));
    }, () => {
        removeClass(rangeInput, "hidden");
    }, 2000);
});
