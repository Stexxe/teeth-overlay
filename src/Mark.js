import {center} from "./utils";

export default class Mark {
    constructor(ctx, position, size) {
        this.ctx = ctx;
        this.position = position;
        this.size = size;
    }

    contains(point) {
        const pos = this.position.valuePoint(...this.canvasSize());
        point = point.valuePoint(...this.canvasSize());

        return (pos.x - this.size / 2 <= point.x && point.x <= pos.x + this.size / 2)
            && (pos.y - this.size / 2 <= point.y && point.y <= pos.y + this.size / 2);
    }

    draw() {
        this.ctx.save();

        this.ctx.fillStyle = '#2FA804';
        let position = center(this.position.valuePoint(...this.canvasSize()), this.size, this.size);
        this.ctx.rect(position.x, position.y, this.size, this.size);
        this.ctx.fill();

        this.ctx.restore();
    }

    canvasSize() {
        return [this.ctx.canvas.width, this.ctx.canvas.height];
    }
}