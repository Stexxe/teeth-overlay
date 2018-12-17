import {assert, Point} from '../utils';
import Mark from '../Mark'

const reDrawStateFn = (ctx, image, state) => marks => {
    const canvas = ctx.canvas;
    canvas.width = state.scale * image.width;
    canvas.height = state.scale * image.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    marks.forEach(mark => mark.draw());
};

const showSetup = state => {
    return new Promise((resolve) => {
        assert(state.image && state.root, 'I need path to image and root element');

        state.root.innerHTML = `
        <canvas id="canvas"></canvas>
        <div class="panel">
            <h4>Click on image and set 3 points: the same eye on both images and border between images</h4>
            <button id="proceed">Process overlay</button>
        </div>
        `;

        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        let marks = [];
        const image = state.image;
        const reDrawState = reDrawStateFn(ctx, image, state);

        reDrawState(marks);

        canvas.addEventListener('click', e => {
            let canvasRect = e.target.getBoundingClientRect();

            const relPoint = new Point(e.clientX, e.clientY)
                .relativeTo( new Point(canvasRect.x, canvasRect.y) )
                .scaleFactorPoint(canvasRect.width, canvasRect.height);

            let markIndex = marks.findIndex(mark => mark.contains(relPoint));

            if (markIndex !== -1) {
                marks.splice(markIndex, 1);
                reDrawState(marks);
            } else if (marks.length < 3) {
                marks.push( new Mark(ctx, relPoint, 10) );
                reDrawState(marks);
            }
        });

        document.getElementById('proceed').addEventListener('click', e => {
            e.preventDefault();
            resolve({
                ...state,
                marks: marks.map(mark => mark.position)
            })
        });

    });
};

export default showSetup;
