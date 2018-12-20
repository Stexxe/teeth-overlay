import {assert, Point} from '../utils';
import Mark from '../Mark'

const MARKS_COUNT = 3;

const reDrawStateFn = (ctx, image, scale) => (marks, zoom) => {
    const canvas = ctx.canvas;
    canvas.width = scale * image.width;
    canvas.height = scale * image.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    marks.forEach(mark => mark.draw());

    if (zoom) {
        const zoomX = zoom.position.x;
        const zoomY = zoom.position.y;

        ctx.save();
        ctx.drawImage(canvas,
            zoomX - zoom.size / 2 / zoom.scale, zoomY - zoom.size / 2 / zoom.scale, zoom.size / zoom.scale, zoom.size / zoom.scale,
            zoomX + 16, zoomY + 16, zoom.size, zoom.size
        );

        ctx.beginPath();
        ctx.fillStyle = "blue";
        const crossHairSize = 3;
        ctx.rect(zoomX + 16 + zoom.size / 2 - crossHairSize / 2, zoomY + 16 + zoom.size / 2 - crossHairSize / 2, crossHairSize, crossHairSize);
        ctx.fill();
        ctx.closePath();

        ctx.restore();
    }
};

const getZoom = (point) => ({
    position: point,
    scale: 8,
    size: 64
});

const showSetup = ({root, image, scale = 1, markSize = 1}) => {
    return new Promise((resolve) => {
        assert(image && root, 'I need an image and root element');

        root.innerHTML = `
        <canvas id="io-canvas"></canvas>
        <div>
            <p>Click on image and set ${MARKS_COUNT} points: the same eye on both images and border between images</p>
            <button id="io-proceed" class="io-btn">Process overlay</button>
        </div>
        `;

        const canvas = document.getElementById('io-canvas');
        const ctx = canvas.getContext('2d');

        let marks = [];
        const reDrawState = reDrawStateFn(ctx, image, scale);

        reDrawState(marks);

        const canvasRect = canvas.getBoundingClientRect();

        canvas.addEventListener('click', e => {
            const relPoint =  new Point(e.clientX, e.clientY)
                .relativeTo( new Point(canvasRect.x, canvasRect.y) );

            const scalePoint = relPoint.scaleFactorPoint(canvasRect.width, canvasRect.height);

            let markIndex = marks.findIndex(mark => mark.contains(scalePoint));

            if (markIndex !== -1) {
                marks.splice(markIndex, 1);
                reDrawState( marks, getZoom(relPoint) );
            } else if (marks.length < MARKS_COUNT) {
                marks.push( new Mark(ctx, scalePoint, markSize) );
                reDrawState( marks, getZoom(relPoint) );
            }
        });

        canvas.addEventListener('mousemove', e => {
            const relPoint = new Point(e.clientX, e.clientY)
                .relativeTo( new Point(canvasRect.x, canvasRect.y) );

            reDrawState(marks, getZoom(relPoint));
        });

        document.getElementById('io-proceed').addEventListener('click', e => {
            e.preventDefault();
            if (marks.length !== MARKS_COUNT) {
                return alert(`Please set ${MARKS_COUNT} marks to proceed`);
            }

            resolve({
                ...{root, image, scale},
                marks: marks.map(mark => mark.position)
            })
        });

    });
};

export default showSetup;
