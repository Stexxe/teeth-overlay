import {Point, toLocalPoint} from '../utils';
import Mark from '../Mark'

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const imagePath = 'assets/man.png';

const reDrawState = (ctx, image, marks) => {
    const canvas = ctx.canvas;
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    marks.forEach(mark => mark.draw());
};

let marks = [];
const image = new Image();
image.src = imagePath;
image.addEventListener('load', (e) => {
    reDrawState(ctx, e.target, marks);
});

canvas.addEventListener('click', (e) => {
    let clickPosition = toLocalPoint(e.target, new Point(e.clientX, e.clientY));
    let markIndex = marks.findIndex(mark => mark.contains(clickPosition));

    if (markIndex !== -1) {
        marks.splice(markIndex, 1);
        reDrawState(ctx, image, marks);
    } else if (marks.length < 3) {
        marks.push( new Mark(ctx, clickPosition, 10) );
        reDrawState(ctx, image, marks);
    }

    console.log(marks);
});

