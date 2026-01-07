export class InputManager {
    up: boolean = false;
    down: boolean = false;
    left: boolean = false;
    right: boolean = false;
    action: boolean = false; // Space or Enter
    menu: boolean = false; // M key

    constructor() {
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }

    private onKeyDown(e: KeyboardEvent) {
        if (e.code === 'ArrowUp' || e.code === 'KeyW') this.up = true;
        if (e.code === 'ArrowDown' || e.code === 'KeyS') this.down = true;
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.left = true;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') this.right = true;
        if (e.code === 'Space' || e.code === 'Enter') this.action = true;
        if (e.code === 'KeyM' || e.code === 'Escape') this.menu = true;
    }

    private onKeyUp(e: KeyboardEvent) {
        if (e.code === 'ArrowUp' || e.code === 'KeyW') this.up = false;
        if (e.code === 'ArrowDown' || e.code === 'KeyS') this.down = false;
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.left = false;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') this.right = false;
        if (e.code === 'Space' || e.code === 'Enter') this.action = false;
        if (e.code === 'KeyM' || e.code === 'Escape') this.menu = false;
    }

    // The original isKeyDown method is no longer directly used by the getters,
    // but if it were to be kept for other purposes, it would need to be re-implemented
    // to check the new boolean properties. For now, we'll keep the structure
    // implied by the edit, which effectively removes the old `keys` Set and its `isKeyDown` usage.
    // The provided edit snippet for isKeyDown was incomplete and syntactically incorrect,
    // so we'll remove the original `isKeyDown` and its getters as they are replaced
    // by the direct boolean properties and the onKeyDown/onKeyUp logic.
}

export const input = new InputManager();
