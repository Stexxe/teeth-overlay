import {assert, Point} from '../utils';
import Mark from '../Mark'

const MARKS_COUNT = 3;

const drawZoom = (ctx, {position, size, scale = 1}) => {
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.drawImage(ctx.canvas,
        position.x - size / 2 / scale, position.y - size / 2 / scale, size / scale, size / scale,
        16, 16, size, size
    );

    ctx.beginPath();
    ctx.fillStyle = "blue";
    const crossHairSize = 3;
    ctx.rect(16 + size / 2 - crossHairSize / 2, 16 + size / 2 - crossHairSize / 2, crossHairSize, crossHairSize);
    ctx.fill();
    ctx.closePath();

    ctx.restore();
};

const reDrawStateFn = (ctx, image) => (marks, zoom) => {
    const canvas = ctx.canvas;
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    marks.forEach(mark => mark.draw());

    if (zoom) {
        drawZoom(ctx, zoom);
    }
};

const getZoom = (point) => ({
    position: point,
    scale: 8,
    size: 64
});

const actualPosition = (event, canvas) => {
    const canvasRect = canvas.getBoundingClientRect();
    return new Point(event.clientX - canvasRect.x, event.clientY - canvasRect.y);
};

const showSetup = ({root, image, height, markSize = 1}) => {
    return new Promise((resolve) => {
        assert(image && root, 'I need an image and root element');

        root.innerHTML = `
        <canvas id="io-canvas"></canvas>
        <div>
            <p>Click on image and set ${MARKS_COUNT} points: the same eye's point on both images</p>
            <button id="io-proceed" class="io-btn">Process overlay</button>
        </div>
        `;

        const canvas = document.getElementById('io-canvas');
        const ctx = canvas.getContext('2d');

        let marks = [];
        const reDrawState = reDrawStateFn(ctx, image);

        reDrawState(marks);

        canvas.addEventListener('click', e => {
            const position =  actualPosition(e, canvas);

            let markIndex = marks.findIndex(mark => mark.contains(position));

            if (markIndex !== -1) {
                marks.splice(markIndex, 1);
                reDrawState( marks, getZoom(position) );
            } else if (marks.length < MARKS_COUNT) {
                marks.push( new Mark(ctx, position, markSize) );
                reDrawState( marks, getZoom(position) );
            }
        });

        canvas.addEventListener('mousemove', e => {
            const position =  actualPosition(e, canvas);
            reDrawState(marks, getZoom(position));
        });

        document.getElementById('io-proceed').addEventListener('click', e => {
            e.preventDefault();
            if (marks.length !== MARKS_COUNT) {
                return alert(`Please set ${MARKS_COUNT} marks to proceed`);
            }

            resolve({
                ...{root, image, height},
                marks: marks.map(mark => mark.position),
            })
        });

    });
};

export default showSetup;
