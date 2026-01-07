import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../engine/constants';
import { input } from '../engine/Input';
import { PARTY } from '../data/Party';
import { ITEMS } from '../data/Items';
import { MAGIC_SPELLS } from '../data/Magic';

type MenuState = 'MAIN' | 'STATUS' | 'MAGIC_SELECT_CHAR' | 'MAGIC_LIST' | 'INVENTORY';

export class MenuScene {
    private state: MenuState = 'MAIN';
    private options = ['STATUS', 'MAGIC', 'INVENTORY', 'EXIT'];
    private selectedIndex = 0;


    // Sub-menu selection
    private selectedCharIndex = 0;

    private onClose: () => void;

    // Assets
    private static partySheet: HTMLImageElement | null = null;

    constructor(onClose: () => void) {
        this.onClose = onClose;
        this.loadAssets();
    }

    private loadAssets() {
        if (!MenuScene.partySheet) {
            MenuScene.partySheet = new Image();
            MenuScene.partySheet.src = '/assets/party.png';
        }
    }

    private inputCooldown = 0;

    update(dt: number) {
        if (this.inputCooldown > 0) {
            this.inputCooldown -= dt;
            return;
        }

        if (input.action) {
            this.handleAction();
            this.inputCooldown = 0.2;
        } else if (input.menu) { // 'M' or Esc to go back
            this.handleBack();
            this.inputCooldown = 0.2;
        } else if (input.up) {
            this.navigate(-1);
            this.inputCooldown = 0.15;
        } else if (input.down) {
            this.navigate(1);
            this.inputCooldown = 0.15;
        }
    }

    private navigate(dir: number) {
        if (this.state === 'MAIN') {
            this.selectedIndex = (this.selectedIndex + dir + this.options.length) % this.options.length;
        } else if (this.state === 'MAGIC_SELECT_CHAR') {
            this.selectedCharIndex = (this.selectedCharIndex + dir + PARTY.length) % PARTY.length;
        } else if (this.state === 'MAGIC_LIST') {
            // Scroll magic?
        } else if (this.state === 'INVENTORY') {
            // Scroll inventory?
        }
    }

    private handleAction() {
        if (this.state === 'MAIN') {
            const opt = this.options[this.selectedIndex];
            if (opt === 'EXIT') {
                this.onClose();
            } else if (opt === 'STATUS') {
                this.state = 'STATUS';
            } else if (opt === 'MAGIC') {
                this.state = 'MAGIC_SELECT_CHAR';
                this.selectedCharIndex = 0;
            } else if (opt === 'INVENTORY') {
                this.state = 'INVENTORY';
            }
        } else if (this.state === 'MAGIC_SELECT_CHAR') {
            this.state = 'MAGIC_LIST';
        } else if (this.state === 'STATUS') {
            this.state = 'MAIN';
        } else if (this.state === 'INVENTORY') {
            this.state = 'MAIN';
        } else if (this.state === 'MAGIC_LIST') {
            this.state = 'MAGIC_SELECT_CHAR';
        }
    }

    private handleBack() {
        if (this.state === 'MAIN') {
            this.onClose();
        } else if (this.state === 'MAGIC_LIST') {
            this.state = 'MAGIC_SELECT_CHAR';
        } else {
            this.state = 'MAIN';
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Draw blue background for menu
        ctx.fillStyle = '#000088';
        ctx.fillRect(50, 50, CANVAS_WIDTH - 100, CANVAS_HEIGHT - 100);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.strokeRect(54, 54, CANVAS_WIDTH - 108, CANVAS_HEIGHT - 108);

        ctx.font = '24px "Courier New"';
        ctx.fillStyle = 'white';

        // Title
        ctx.fillText(`-- ${this.state} --`, 80, 90);

        if (this.state === 'MAIN') {
            this.options.forEach((opt, i) => {
                ctx.fillStyle = i === this.selectedIndex ? 'yellow' : 'white';
                ctx.fillText(opt, 100, 150 + i * 40);
                if (i === this.selectedIndex) ctx.fillText('▶', 70, 150 + i * 40);
            });
        }
        else if (this.state === 'STATUS') {
            PARTY.forEach((char, i) => {
                const y = 140 + i * 80;

                if (MenuScene.partySheet && MenuScene.partySheet.complete) {
                    const sx = (i % 2) * 32;
                    const sy = Math.floor(i / 2) * 32;
                    ctx.drawImage(MenuScene.partySheet, sx, sy, 32, 32, 80, y - 20, 32, 32);
                } else {
                    ctx.fillStyle = char.spriteColor;
                    ctx.fillRect(80, y - 20, 32, 32);
                }

                ctx.fillStyle = 'white';
                ctx.font = '20px monospace';
                ctx.fillText(`${char.name} Lv.${char.stats.level}`, 130, y);
                ctx.font = '16px monospace';
                ctx.fillText(`HP: ${char.stats.hp}/${char.stats.maxHp}  MP: ${char.stats.mp}/${char.stats.maxMp}`, 130, y + 20);
                ctx.fillText(`Str: ${char.stats.strength} Def: ${char.stats.defense} Spd: ${char.stats.speed}`, 130, y + 40);
            });
        }
        else if (this.state === 'INVENTORY') {
            ITEMS.forEach((item, i) => {
                ctx.fillStyle = 'white';
                ctx.fillText(`${item.name}`, 100, 150 + i * 40);
                ctx.fillText(`x${item.quantity}`, 300, 150 + i * 40);
                ctx.font = '14px monospace';
                ctx.fillStyle = '#ccc';
                ctx.fillText(item.description, 350, 150 + i * 40);
                ctx.font = '24px "Courier New"';
            });
        }
        else if (this.state === 'MAGIC_SELECT_CHAR') {
            ctx.fillText("Select Character:", 80, 130);
            PARTY.forEach((char, i) => {
                const y = 170 + i * 40;
                ctx.fillStyle = i === this.selectedCharIndex ? 'yellow' : 'white';
                ctx.fillText(char.name, 100, y);
                if (i === this.selectedCharIndex) ctx.fillText('▶', 70, y);
            });
        }
        else if (this.state === 'MAGIC_LIST') {
            const char = PARTY[this.selectedCharIndex];
            ctx.fillStyle = 'yellow';
            ctx.fillText(`${char.name}'s Magic`, 80, 130);

            // Filter spells
            const knownSpells = MAGIC_SPELLS.filter(s => char.stats.level >= s.requiredLevel);

            if (knownSpells.length === 0) {
                ctx.fillStyle = 'gray';
                ctx.fillText("No magic learned.", 100, 180);
            } else {
                knownSpells.forEach((spell, i) => {
                    const y = 170 + i * 30;
                    if (y > CANVAS_HEIGHT - 80) return; // Clip

                    ctx.fillStyle = 'white';
                    ctx.font = '20px monospace';
                    ctx.fillText(spell.name, 100, y);
                    ctx.fillText(`${spell.mpCost} MP`, 300, y);
                });
            }
        }
    }
}
