import {addEvent, appendChildren} from "../dom";
import {findMark, Mark} from "../Mark";
import {Point} from "../Point";
import {defineStage} from "../stage";
import {append, center, localMousePosition, remove} from "../utils";
import {appendStyles, createEl, setRenderState} from "./common";

interface InputType {
    root: HTMLElement;
    image: HTMLImageElement;
}

interface OutputType {
    root: HTMLElement;
    image: HTMLImageElement;
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

export const setupStage = defineStage<InputType, OutputType>(({root, image}, pass) => {
    let state: StateType = {image, marks: []};

    appendStyles();

    const canvas = createEl("canvas") as HTMLCanvasElement;
    const proceedBtn = createEl("button", {className: "btn", innerText: "Process overlay"});

    appendChildren(root, [
        canvas,
        createEl("div", {}, [
            createEl("p", {innerText: "Click on image and set 3 points: border and the same eye on both images"}),
            proceedBtn,
        ]),
    ]);

    addEvent(canvas, "click", (e) => {
        const position = localMousePosition(e as MouseEvent, canvas);
        const [isMarkClicked, markIndex] = findMark(state.marks, position);

        const marks = isMarkClicked ? remove(state.marks, markIndex) :
            state.marks.length < MARKS_TOTAL ? append(state.marks, position) : state.marks;

        state = setRenderState(state, {marks}, (s) => renderState(ctx, s));
    });

    addEvent(canvas, "mousemove", (e) => {
        const position = localMousePosition(e as MouseEvent, canvas);
        state = setRenderState(state, {zoom: position}, (s) => renderState(ctx, s));
    });

    addEvent(proceedBtn, "click", (e) => {
        e.preventDefault();

        if (state.marks.length !== MARKS_TOTAL) {
            return alert(`Please set ${MARKS_TOTAL} marks to proceed`);
        }

        pass({root, image, marks: state.marks});
    });

    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    renderState(ctx, state);
});
