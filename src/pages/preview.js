import {Rect} from "../utils";

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

const showPreview = state => {
    return new Promise((resolve, reject) => {
        if (!state.image || state.marks.length !== 3) {
            reject('I need image and marks');
        }

        const marks = state.marks.slice().sort((p1, p2) => p1.x - p2.x);
        const [before, after] = calcBeforeAfter(marks, state.image);
        const step = (before.width / 10);

        state.root.innerHTML = `
            <canvas id="canvas"></canvas>
            <div class="panel">
                <input id="overlay" type="range" min="0" max="${before.width}" step="${step}" value="0">
            </div>
        `;

        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const redrawState = redrawStateFn(ctx, state.image, before, after);

        canvas.height = before.height;
        canvas.width = before.width;

        redrawState(0);

        document.getElementById('overlay').addEventListener('input', (e) => {
            const fill = Number.parseFloat(e.target.value);
            redrawState(fill);
        });
    });
};

export default showPreview;
