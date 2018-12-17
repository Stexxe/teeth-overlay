import {Point, Rect} from "./utils";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const state = {
    image: 'assets/woman.png',
    // marks: [new Point(197, 0), new Point(593, 0), new Point(396, 0)]
    marks: [new Point(957, 0), new Point(1473, 0), new Point(415, 0)]
};

if (!state.image || state.marks.length !== 3) {
    console.warn('Wrong initial state');
}

const marks = state.marks.slice().sort((p1, p2) => p1.x - p2.x);
const image = new Image();
image.src = state.image;

const calcBeforeAfter = (marks, image) => {
    const beforeWidth = marks[1].x;
    const afterX = beforeWidth + 1;
    const hDelta = marks[2].x - afterX - marks[0].x;

    return [
        new Rect(0, 0, beforeWidth, image.height),
        new Rect(afterX + hDelta, 0, image.width + hDelta - beforeWidth, image.height),
    ];
};

const redrawStateFn = (ctx, image, before, after) => fill => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(image, 0, 0, before.width, before.height, 0, 0, before.width, before.height);
    ctx.drawImage(image, after.x, after.y, fill, after.height, 0, 0, fill, after.height);
};

image.addEventListener('load', (e) => {
    const [before, after] = calcBeforeAfter(marks, e.target);
    const segments = 10;
    const redrawState = redrawStateFn(ctx, e.target, before, after);

    canvas.height = before.height;
    canvas.width = before.width;

    redrawState(0);

    const overlayRange = document.getElementById('overlay');
    overlayRange.max = before.width.toString();
    overlayRange.step = (before.width / segments).toString();

    overlayRange.addEventListener('input', (e) => {
        const fill = Number.parseFloat(e.target.value);
        redrawState(fill);
    });
});

