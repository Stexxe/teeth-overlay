import {assert} from "../utils";

const redrawStateFn = (ctx, image, scale, marks) => fill => {
    const beforeWidth = marks[1].x;
    const hDelta = marks[2].x - beforeWidth - marks[0].x;
    const afterStartX = beforeWidth + hDelta;

    ctx.canvas.width = scale * beforeWidth * image.width;
    ctx.canvas.height = scale * image.height;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(image, 0, 0, beforeWidth * image.width, image.height, 0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(image, afterStartX * image.width, 0, fill * image.width, image.height, 0, 0, fill * image.width * scale, image.height * scale);
};

const showPreview = state => {
    return new Promise(() => {
        assert(state.image && state.marks.length === 3, 'I need image and marks');

        const marks = state.marks.slice().sort((p1, p2) => p1.x - p2.x);
        const width = marks[1].x;
        const step = width / 10;

        state.root.innerHTML = `
            <canvas id="canvas"></canvas>
            <div class="panel">
                <input id="overlay" type="range" min="0" max="${width}" step="${step}" value="0">
            </div>
        `;

        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const redrawState = redrawStateFn(ctx, state.image, state.scale, marks);

        redrawState(0);

        document.getElementById('overlay').addEventListener('input', (e) => {
            const fill = Number.parseFloat(e.target.value);
            redrawState(fill);
        });
    });
};

export default showPreview;
