import {center} from "./utils";

export default class Mark {
    constructor(ctx, position, size) {
        this.ctx = ctx;
        this.position = position;
        this.size = size;
    }

    contains(point) {
        return (this.position.x - this.size / 2 <= point.x && point.x <= this.position.x + this.size / 2)
            && (this.position.y - this.size / 2 <= point.y && point.y <= this.position.y + this.size / 2);
    }

    draw() {
        this.ctx.save();

        this.ctx.fillStyle = '#2FA804';
        let position = center(this.position, this.size, this.size);
        this.ctx.rect(position.x, position.y, this.size, this.size);
        this.ctx.fill();

        this.ctx.restore();
    }
}