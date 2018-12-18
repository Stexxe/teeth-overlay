import {insideCircle, Point} from "../utils";

export default class Scanner {
    constructor(ctx) {
        this.ctx = ctx;
        this.position = new Point(0, 0);
        this.size = 16;

        let hold = false;
        this.ctx.canvas.addEventListener('mousedown', (e) => {
            const rect = this.ctx.canvas.getBoundingClientRect();
            const localPoint = new Point(e.clientX, e.clientY).relativeTo( new Point(rect.x, rect.y) );

            if (insideCircle(this.position, this.size, localPoint)) {
                hold = true;
            }
        });

        this.ctx.canvas.addEventListener('mouseup', () => {
            hold = false;
        });

        this.ctx.canvas.addEventListener('mousemove', e => {
            if (hold && e.buttons === 1) {
                const rect = this.ctx.canvas.getBoundingClientRect();
                this.position = new Point(e.clientX, e.clientY).relativeTo( new Point(rect.x, rect.y) );
            }
        });
    }

    render() {
        this.drawCircle(this.position, this.size);
    }

    drawCircle(center, rad, color='rgba(0, 0, 0, 0.5)') {
        this.ctx.arc(center.x, center.y, rad, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
}