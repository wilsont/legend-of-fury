export type UpdateFn = (deltaTime: number) => void;
export type DrawFn = (ctx: CanvasRenderingContext2D) => void;

export class GameLoop {
    private lastTime: number = 0;
    private running: boolean = false;
    private updateFn: UpdateFn;
    private drawFn: DrawFn;
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;

    constructor(update: UpdateFn, draw: DrawFn) {
        this.updateFn = update;
        this.drawFn = draw;
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        // Disable smoothing for pixel art look
        if (this.ctx) {
            this.ctx.imageSmoothingEnabled = false;
        }
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop);
    }

    stop() {
        this.running = false;
    }

    private loop = (time: number) => {
        if (!this.running) return;

        const deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.updateFn(deltaTime);

        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawFn(this.ctx);
        }

        requestAnimationFrame(this.loop);
    };
}
