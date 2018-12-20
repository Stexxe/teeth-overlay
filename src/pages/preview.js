import {assert} from "../utils";

const redrawStateFn = (ctx, image, [left, middle, right]) => fill => {
    const beforeWidthF = middle.x;
    const hDelta = right.x - beforeWidthF - left.x;
    const afterStartX = middle.x + hDelta;
    const afterWidthF = image.width - afterStartX;

    ctx.canvas.width = beforeWidthF;
    ctx.canvas.height = image.height;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(image,
        0, 0, beforeWidthF, image.height,
        0, 0, ctx.canvas.width, ctx.canvas.height);

    const GAP_PERCENT = 0.05;
    const GAP_PX = GAP_PERCENT * beforeWidthF;

    if (fill !== 0) {
        fill = (fill + 2 * GAP_PX > afterWidthF ? afterWidthF - 2 * GAP_PX : fill);

        if (fill)
            ctx.drawImage(image,
                afterStartX + GAP_PX, 0, fill, image.height,
                GAP_PX, 0, fill, image.height);
    }
};

const showPreview = ({root, image, marks, height}) => {
    return new Promise(() => {
        assert(root && image && marks && marks.length === 3, 'I need root element, image and marks');

        marks = marks.slice().sort((p1, p2) => p1.x - p2.x);
        const rangeMax = marks[1].x;

        root.innerHTML = `
            <canvas id="io-canvas"></canvas>
            <div class="panel">
                <input class="io-slider" id="io-overlay" type="range" min="0" step="${rangeMax / 10}" value="0" max="${rangeMax}">
            </div>
        `;

        const canvas = document.getElementById('io-canvas');
        const ctx = canvas.getContext('2d');
        const redrawState = redrawStateFn(ctx, image, marks);

        redrawState(0);

        canvas.style.height = `${height}px`;
        const rangeEl = document.getElementById('io-overlay');
        rangeEl.style.width = `${canvas.offsetWidth}px`;

        rangeEl.addEventListener('input', (e) => {
            const fill = Number.parseFloat(e.target.value);
            redrawState(fill);
        });
    });
};

export default showPreview;
