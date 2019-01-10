import {addEvent, appendChildren} from "../dom";
import {findMark, Mark} from "../Mark";
import {Point} from "../Point";
import {defineStage} from "../stage";
import {append, center, localMousePosition, remove} from "../utils";
import {appendStyles, createEl, setRenderState} from "./common";

export interface InputType {
    root: HTMLElement;
    image: HTMLImageElement;
    maxHeight?: number;
}

interface OutputType {
    root: HTMLElement;
    image: HTMLImageElement;
    maxHeight?: number;
    marks: Mark[];
}

interface StateType {
    image: HTMLImageElement;
    marks: Mark[];
    zoom?: Point;
}

const MARKS_TOTAL = 3;

function renderState(ctx: CanvasRenderingContext2D, {image, marks, zoom}: StateType) {
    ctx.clearRect(0, 0, image.width, image.height);
    ctx.drawImage(image, 0, 0, image.width, image.height);
    marks.forEach((mark) => renderMark(ctx, mark));
    if (zoom) { renderZoom( ctx, zoom); }
}

function renderZoom(ctx: CanvasRenderingContext2D, [x, y]: Point, size = 64, scale = 8, crossHairSize = 3, shift = 16) {
    ctx.save();

    ctx.drawImage(ctx.canvas,
        x - size / 2 / scale, y - size / 2 / scale, size / scale, size / scale,
        x + shift, y + shift, size, size,
    );
    ctx.beginPath();
    ctx.fillStyle = "blue";
    const crossHairDelta = (shift + size / 2 - crossHairSize / 2);
    ctx.rect(x + crossHairDelta, y + crossHairDelta, crossHairSize, crossHairSize);
    ctx.fill();
    ctx.closePath();

    ctx.restore();
}

function renderMark(ctx: CanvasRenderingContext2D, position: Mark, size = 1) {
    ctx.save();

    ctx.fillStyle = "#2FA804";
    ctx.beginPath();
    const [centerX, centerY] = center(position, [size, size]);
    ctx.rect(centerX, centerY, size, size);
    ctx.fill();
    ctx.closePath();

    ctx.restore();
}

export const stage = defineStage<InputType, OutputType>(({root, image, maxHeight}, pass) => {
    let state: StateType = {image, marks: []};

    appendStyles();

    const canvas = createEl("canvas", {className: "zoom-in"}) as HTMLCanvasElement;
    const proceedBtn = createEl("button", {className: "btn", innerText: "Process overlay"});
    const resetBtn = createEl("button", {className: "btn reset-marks", innerText: "Remove points"});

    appendChildren(root, [
        canvas,
        createEl("div", {}, [
            createEl("p", {innerText: "Click on image and set 3 points: border and the same eye on both images"}),
            proceedBtn,
            resetBtn,
        ]),
    ]);

    addEvent(canvas, "click", (e) => {
        const position = localMousePosition(e as MouseEvent, canvas);
        const [isMarkClicked, markIndex] = findMark(state.marks, position);

        const marks = isMarkClicked ? remove(state.marks, markIndex) :
            state.marks.length < MARKS_TOTAL ? append(state.marks, position) : state.marks;

        state = setRenderState(state, {marks}, (s) => renderState(ctx, s));
    });

    let timeoutID: number;
    const delayedZoom = false;
    addEvent(canvas, "mousemove", (e) => {
        const position = localMousePosition(e as MouseEvent, canvas);
        const render = () => {
            state = setRenderState(state, {zoom: position}, (s) => renderState(ctx, s));
        };

        if (delayedZoom) {
            if (timeoutID) {
                clearTimeout(timeoutID);
            }

            // @ts-ignore
            timeoutID = setTimeout(render, 500);
        } else {
            render();
        }
    });

    addEvent(proceedBtn, "click", (e) => {
        e.preventDefault();

        if (state.marks.length !== MARKS_TOTAL) {
            return alert(`Please set ${MARKS_TOTAL} points to proceed`);
        }

        pass({root, image, maxHeight, marks: state.marks});
    });

    addEvent(resetBtn, "click", (e) => {
        e.preventDefault();
        state = setRenderState(state, {marks: []}, (s) => renderState(ctx, s));
    });

    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    renderState(ctx, state);
});
