import {assert} from "../utils";

const scale = (val, ...factors) => val * factors.reduce((acc, x) => acc * x, 1);

const redrawStateFn = (ctx, image, scaleF, marks) => fill => {
    const beforeWidthF = marks[1].x;
    const hDelta = marks[2].x - beforeWidthF - marks[0].x;
    const afterStartX = beforeWidthF + hDelta;
    const afterWidthF = 1.0 - afterStartX;

    ctx.canvas.width = scale(image.width, scaleF, beforeWidthF);
    ctx.canvas.height = scale(image.height, scaleF);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(image,
        0, 0, scale(image.width, beforeWidthF), image.height,
        0, 0, ctx.canvas.width, ctx.canvas.height);

    const HORIZONTAL_GAP = 0.05;

    if (fill !== 0) {
        fill = (fill + 2 * HORIZONTAL_GAP > afterWidthF ? afterWidthF - 2 * HORIZONTAL_GAP : fill);

        if (fill)
            ctx.drawImage(image,
                scale(image.width, afterStartX + HORIZONTAL_GAP), 0, scale(image.width, fill), image.height,
                scale(image.width, scaleF, HORIZONTAL_GAP), 0, scale(image.width, scaleF, fill), scale(image.height, scaleF));
    }
};

const showPreview = state => {
    return new Promise(() => {
        assert(state.root && state.image && state.marks.length === 3, 'I need root element, image and marks');

        const marks = state.marks.slice().sort((p1, p2) => p1.x - p2.x);
        const width = marks[1].x;
        const rangeMax = 100;

        state.root.innerHTML = `
            <canvas id="io-canvas"></canvas>
            <div class="panel">
                <input class="io-slider" id="io-overlay" type="range" min="0" step="10" value="0" max="${rangeMax}">
            </div>
        `;

        const canvas = document.getElementById('io-canvas');
        const ctx = canvas.getContext('2d');
        const scale = state.scale || 1.0;
        const redrawState = redrawStateFn(ctx, state.image, scale, marks);

        redrawState(0);

        const rangeEl = document.getElementById('io-overlay');
        rangeEl.style.width = `${canvas.width}px`;

        rangeEl.addEventListener('input', (e) => {
            const fill = Number.parseInt(e.target.value, 10);
            redrawState(fill / rangeMax * width);
        });
    });
};

export default showPreview;
