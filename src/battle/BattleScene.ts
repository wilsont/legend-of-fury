import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../engine/constants';
import { input } from '../engine/Input';
import type { Character, Enemy, MagicSpell } from '../engine/types';
import { PARTY } from '../data/Party';
import { MAGIC_SPELLS } from '../data/Magic';

type BattleState = 'PLAYER_TURN' | 'ENEMY_TURN' | 'VICTORY' | 'DEFEAT' | 'MAGIC_MENU';
type MenuOption = 'FIGHT' | 'MAGIC' | 'ITEM' | 'RUN';

export class BattleScene {
    private enemies: Enemy[];
    private party: Character[];
    private battleState: BattleState = 'PLAYER_TURN';

    private selectedMenuIndex: number = 0;
    private menuOptions: MenuOption[] = ['FIGHT', 'MAGIC', 'ITEM', 'RUN'];

    // Magic Menu
    private selectedMagicIndex: number = 0;
    private availableSpells: MagicSpell[] = [];

    private onBattleEnd: (win: boolean) => void;

    // Turn logic
    private activeCharacterIndex: number = 0;
    private turnTimer: number = 0;

    // UI Messages
    private battleLog: string[] = [];

    // Assets
    private static partySheet: HTMLImageElement | null = null;
    private static enemySheet: HTMLImageElement | null = null;

    constructor(enemies: Enemy[], onBattleEnd: (win: boolean) => void) {
        this.enemies = enemies;
        this.onBattleEnd = onBattleEnd;
        this.loadAssets();
        this.party = PARTY;
    }

    update(dt: number) {
        if (this.battleState === 'VICTORY' || this.battleState === 'DEFEAT') {
            if (input.action) {
                this.onBattleEnd(this.battleState === 'VICTORY');
            }
            return;
        }

        if (this.battleState === 'PLAYER_TURN' || this.battleState === 'MAGIC_MENU') {
            this.handleInput(dt);
        } else {
            // Enemy turn
            this.turnTimer += dt;
            if (this.turnTimer > 1.0) {
                this.enemyAttack();
                this.turnTimer = 0;
            }
        }
    }

    private inputCooldown = 0;
    private handleInput(dt: number) {
        if (this.inputCooldown > 0) {
            this.inputCooldown -= dt;
            return;
        }

        const activeChar = this.party[this.activeCharacterIndex];

        if (this.battleState === 'PLAYER_TURN') {
            if (input.down) {
                this.selectedMenuIndex = (this.selectedMenuIndex + 1) % this.menuOptions.length;
                this.inputCooldown = 0.2;
            } else if (input.up) {
                this.selectedMenuIndex = (this.selectedMenuIndex - 1 + this.menuOptions.length) % this.menuOptions.length;
                this.inputCooldown = 0.2;
            } else if (input.action) {
                const option = this.menuOptions[this.selectedMenuIndex];
                if (option === 'MAGIC') {
                    // Filter spells based on level
                    this.availableSpells = MAGIC_SPELLS.filter(s => activeChar.stats.level >= s.requiredLevel);
                    if (this.availableSpells.length > 0) {
                        this.battleState = 'MAGIC_MENU';
                        this.selectedMagicIndex = 0;
                    } else {
                        this.log(`No magic available!`);
                    }
                } else {
                    this.executeAction(option);
                }
                this.inputCooldown = 0.3;
            }
        } else if (this.battleState === 'MAGIC_MENU') {
            if (input.down) {
                this.selectedMagicIndex = (this.selectedMagicIndex + 1) % this.availableSpells.length;
                this.inputCooldown = 0.2;
            } else if (input.up) {
                this.selectedMagicIndex = (this.selectedMagicIndex - 1 + this.availableSpells.length) % this.availableSpells.length;
                this.inputCooldown = 0.2;
            } else if (input.action) {
                this.castSpell(this.availableSpells[this.selectedMagicIndex]);
                this.inputCooldown = 0.5;
            }
            // TODO: Back button
        }
    }

    private executeAction(option: MenuOption) {
        if (option === 'FIGHT') {
            const damage = this.party[this.activeCharacterIndex].stats.strength;
            this.dealDamageToEnemy(damage);
        } else if (option === 'RUN') {
            this.onBattleEnd(false);
        } else if (option === 'ITEM') {
            this.log("Items not implemented!");
        }
    }

    private castSpell(spell: MagicSpell) {
        const char = this.party[this.activeCharacterIndex];
        if (char.stats.mp < spell.mpCost) {
            this.log("Not enough MP!");
            this.battleState = 'PLAYER_TURN';
            return;
        }

        char.stats.mp -= spell.mpCost;
        this.log(`${char.name} casts ${spell.name}!`);
        this.dealDamageToEnemy(spell.power);
    }

    private dealDamageToEnemy(amount: number) {
        this.enemies[0].stats.hp -= amount;
        this.log(`Dealt ${amount} damage!`);

        if (this.enemies[0].stats.hp <= 0) {
            this.handleVictory();
        } else {
            this.nextTurn();
        }
    }

    private handleVictory() {
        this.battleState = 'VICTORY';
        const totalXp = this.enemies.reduce((acc, e) => acc + e.xpReward, 0);
        this.log(`Victory! Gained ${totalXp} XP.`);

        this.party.forEach(char => {
            if (char.stats.hp > 0) {
                char.stats.exp += totalXp;
                // Level Up Check
                const nextLevelXp = char.stats.level * 100;
                if (char.stats.exp >= nextLevelXp && char.stats.level < 99) {
                    char.stats.level++;
                    char.stats.exp -= nextLevelXp;

                    while (char.stats.exp >= 100 && char.stats.level < 99) {
                        char.stats.exp -= 100;
                        char.stats.level++;

                        // Randomized Stat Growth
                        // Str/Def/Speed: +1-5
                        const dStr = Math.floor(Math.random() * 5) + 1;
                        const dDef = Math.floor(Math.random() * 5) + 1;
                        const dSpd = Math.floor(Math.random() * 5) + 1;

                        // HP/MP: +10-20
                        const dHp = Math.floor(Math.random() * 11) + 10;
                        const dMp = Math.floor(Math.random() * 11) + 10;

                        char.stats.maxHp += dHp;
                        char.stats.hp = char.stats.maxHp; // Full heal on level up? Standard JRPG trope or just max increase? Usually current HP doesn't fill but let's be generous or just increase max. 
                        // Requested: "increase ... hp and mp between 10-20". I'll increase Max and heal fully for simplicity/reward.

                        char.stats.maxMp += dMp;
                        char.stats.mp = char.stats.maxMp;

                        char.stats.strength += dStr;
                        char.stats.defense += dDef;
                        char.stats.speed += dSpd;

                        this.log(`${char.name} grew to Level ${char.stats.level}!`);
                        this.log(`HP+${dHp} MP+${dMp} Str+${dStr} Def+${dDef} Spd+${dSpd}`);
                    }
                }
            }
        });
    }

    private nextTurn() {
        this.activeCharacterIndex++;
        if (this.activeCharacterIndex >= this.party.length) {
            this.activeCharacterIndex = 0;
            this.battleState = 'ENEMY_TURN';
        } else if (this.party[this.activeCharacterIndex].stats.hp <= 0) {
            this.nextTurn(); // Skip dead chars
        } else {
            this.battleState = 'PLAYER_TURN';
        }
    }

    private enemyAttack() {
        // Simple AI
        const aliveParty = this.party.filter(p => p.stats.hp > 0);
        if (aliveParty.length === 0) {
            this.battleState = 'DEFEAT';
            return;
        }

        const target = aliveParty[Math.floor(Math.random() * aliveParty.length)];
        const damage = this.enemies[0].stats.strength;
        target.stats.hp -= damage;
        this.log(`Enemy attacked ${target.name} for ${damage}!`);

        if (target.stats.hp <= 0) {
            this.log(`${target.name} fell!`);
        } else {
            // Maybe flash screen red?
        }

        if (this.party.every(p => p.stats.hp <= 0)) {
            this.battleState = 'DEFEAT';
        } else {
            this.battleState = 'PLAYER_TURN';
            // Find next alive
            while (this.party[this.activeCharacterIndex].stats.hp <= 0) {
                this.activeCharacterIndex = (this.activeCharacterIndex + 1) % this.party.length;
            }
        }
    }

    private loadAssets() {
        if (!BattleScene.partySheet) {
            BattleScene.partySheet = new Image();
            BattleScene.partySheet.src = '/assets/party.png';
        }
        if (!BattleScene.enemySheet) {
            BattleScene.enemySheet = new Image();
            BattleScene.enemySheet.src = '/assets/enemies.png';
        }
    }

    private log(msg: string) {
        this.battleLog.push(msg);
        if (this.battleLog.length > 5) this.battleLog.shift();
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Draw Background
        ctx.fillStyle = '#000022';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw Menu
        const menuHeight = 150;
        const menuY = CANVAS_HEIGHT - menuHeight;
        ctx.fillStyle = '#000088';
        ctx.fillRect(0, menuY, CANVAS_WIDTH, menuHeight);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.strokeRect(4, menuY + 4, CANVAS_WIDTH - 8, menuHeight - 8);

        ctx.font = '24px "Courier New"';

        if (this.battleState === 'MAGIC_MENU') {
            // Draw Magic List
            this.availableSpells.forEach((spell, idx) => {
                const x = 50 + (Math.floor(idx / 4) * 200);
                const y = menuY + 40 + ((idx % 4) * 30);
                ctx.fillStyle = idx === this.selectedMagicIndex ? 'yellow' : 'white';
                ctx.fillText(spell.name, x, y);
                ctx.font = '16px "Courier New"';
                ctx.fillText(`${spell.mpCost} MP`, x + 150, y);
                ctx.font = '24px "Courier New"';
            });
        } else {
            // Draw Main Menu
            this.menuOptions.forEach((opt, idx) => {
                ctx.fillStyle = idx === this.selectedMenuIndex ? 'yellow' : 'white';
                ctx.fillText(opt, 50, menuY + 50 + (idx * 30));
                if (idx === this.selectedMenuIndex) {
                    ctx.fillText('▶', 20, menuY + 50 + (idx * 30));
                }
            });
        }

        // Log
        ctx.font = '16px monospace';
        ctx.fillStyle = '#aaa';
        this.battleLog.forEach((msg, i) => {
            ctx.fillText(msg, 300, menuY + 30 + (i * 20));
        });

        // Draw Enemies
        this.enemies.forEach((enemy, i) => {
            if (enemy.stats.hp > 0) {
                const ex = 100;
                const ey = 200 + (i * 100);

                if (BattleScene.enemySheet && BattleScene.enemySheet.complete) {
                    const types = ['SLIME', 'BAT', 'LION', 'TIGER', 'DOG'];
                    const idx = types.indexOf(enemy.id.toUpperCase()); // Using id instead of name for key
                    const sx = (idx % 3) * 32;
                    const sy = Math.floor(idx / 3) * 32;
                    ctx.drawImage(BattleScene.enemySheet, sx, sy, 32, 32, ex, ey, 64, 64);
                } else {
                    ctx.fillStyle = enemy.spriteColor;
                    ctx.fillRect(ex, ey, 64, 64);
                }

                // Level label for enemy
                ctx.fillStyle = 'white';
                ctx.fillText(`Lv.${enemy.stats.level || 1} ${enemy.name}`, 100, 170 + (i * 100));

                ctx.fillStyle = 'red';
                ctx.fillRect(100, 180 + (i * 100), 64, 10);
                ctx.fillStyle = 'green';
                const hpPct = Math.max(0, enemy.stats.hp / enemy.stats.maxHp);
                ctx.fillRect(100, 180 + (i * 100), 64 * hpPct, 10);
            }
        });

        // Draw Party
        this.party.forEach((char, i) => {
            const x = CANVAS_WIDTH - 250 + (i * 30);
            const y = 150 + (i * 60);

            if (BattleScene.partySheet && BattleScene.partySheet.complete) {
                const sx = (i % 2) * 32;
                const sy = Math.floor(i / 2) * 32;
                ctx.drawImage(BattleScene.partySheet, sx, sy, 32, 32, x, y, 48, 48);
            } else {
                ctx.fillStyle = char.spriteColor;
                ctx.fillRect(x, y, 48, 48);
            }

            if ((this.battleState === 'PLAYER_TURN' || this.battleState === 'MAGIC_MENU') && i === this.activeCharacterIndex) {
                ctx.fillStyle = 'yellow';
                ctx.fillText('▼', x + 15, y - 10);
            }

            ctx.fillStyle = 'white';
            ctx.font = '16px monospace';
            ctx.fillText(`${char.name} Lv.${char.stats.level}`, x + 60, y + 15);
            ctx.fillText(`HP:${char.stats.hp}/${char.stats.maxHp}`, x + 60, y + 30);
            ctx.fillText(`MP:${char.stats.mp}/${char.stats.maxMp}`, x + 60, y + 45);
        });

        if (this.battleState === 'VICTORY') {
            ctx.fillStyle = 'yellow';
            ctx.font = '40px "Courier New"';
            ctx.fillText("VICTORY!", CANVAS_WIDTH / 2 - 100, 100);
        } else if (this.battleState === 'DEFEAT') {
            ctx.fillStyle = 'red';
            ctx.font = '40px "Courier New"';
            ctx.fillText("GAME OVER", CANVAS_WIDTH / 2 - 120, 100);
        }
    }
}
