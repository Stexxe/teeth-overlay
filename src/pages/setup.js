import {Point, toLocalPoint, createEl} from '../utils';
import Mark from '../Mark'

const reDrawState = (ctx, image, marks) => {
    const canvas = ctx.canvas;
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    marks.forEach(mark => mark.draw());
};

const showSetup = state => {
    return new Promise((resolve, reject) => {
        if ( !(state.image && state.root) ) {
            return reject('I need path to image and root element');
        }

        const canvas = document.createElement('canvas');
        state.root.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let marks = [];
        const image = state.image;

        reDrawState(ctx, image, marks);

        canvas.addEventListener('click', e => {
            let clickPosition = toLocalPoint(e.target, new Point(e.clientX, e.clientY));
            let markIndex = marks.findIndex(mark => mark.contains(clickPosition));

            if (markIndex !== -1) {
                marks.splice(markIndex, 1);
                reDrawState(ctx, image, marks);
            } else if (marks.length < 3) {
                marks.push( new Mark(ctx, clickPosition, 10) );
                reDrawState(ctx, image, marks);
            }
        });

        let panel = createEl('div', {className: 'panel'});
        let proceedButton = createEl('button', {innerText: 'Process overlay'});

        panel.appendChild(proceedButton);
        state.root.insertBefore(panel, canvas.nextSibling);

        proceedButton.addEventListener('click', e => {
            e.preventDefault();
            resolve({
                ...state,
                marks: marks.map(mark => mark.position)
            })
        });

    });
};

export default showSetup;
