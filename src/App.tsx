import { useEffect, useRef, useState } from 'react';
import './App.css';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './engine/constants';
import { GameLoop } from './engine/GameLoop';
import { MapScene } from './map/MapScene';
import type { GameState } from './engine/types';
import { BattleScene } from './battle/BattleScene';
import { ENEMIES } from './data/Enemies';
import { MenuScene } from './menu/MenuScene';
import { input } from './engine/Input'; // Need input to toggle menu

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<GameLoop | null>(null);
  const [gameState, setGameState] = useState<GameState>('MAP');

  // Refs for scenes to persist state between renders/mode switches if needed
  // Using refs ensures we don't recreate the map/player position on every render
  // Refs for scenes to persist state between renders/mode switches if needed
  // Using refs ensures we don't recreate the map/player position on every render
  const mapSceneRef = useRef<MapScene | null>(null);
  const battleSceneRef = useRef<BattleScene | null>(null);
  const menuSceneRef = useRef<MenuScene | null>(null);

  useEffect(() => {
    // Initialize Map Scene once
    if (!mapSceneRef.current) {
      mapSceneRef.current = new MapScene((enemyType: string, onDefeat: () => void) => {
        console.log(`Encounter with ${enemyType}!`);

        const allEnemyKeys = Object.keys(ENEMIES);

        // Primary Enemy (Cloned and Healed)
        const primaryTemplate = ENEMIES[enemyType] || ENEMIES['SLIME'];
        const enemiesList = [{
          ...primaryTemplate,
          stats: {
            ...primaryTemplate.stats,
            hp: primaryTemplate.stats.maxHp,
            mp: primaryTemplate.stats.maxMp
          }
        }];

        // Add 0-2 random reinforcements (Cloned and Healed)
        const reinforcementCount = Math.floor(Math.random() * 3); // 0, 1, or 2
        for (let i = 0; i < reinforcementCount; i++) {
          const randKey = allEnemyKeys[Math.floor(Math.random() * allEnemyKeys.length)];
          const t = ENEMIES[randKey];
          enemiesList.push({
            ...t,
            stats: {
              ...t.stats,
              hp: t.stats.maxHp,
              mp: t.stats.maxMp
            }
          });
        }

        // Initialize Battle Scene
        battleSceneRef.current = new BattleScene(enemiesList, (win: boolean) => {
          if (win) {
            onDefeat(); // Remove enemy from map
          }
          setGameState('MAP');
          battleSceneRef.current = null;
        });

        setGameState('BATTLE');
      });
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize Game Loop
    const loop = new GameLoop(
      (dt) => {
        if (gameState === 'MAP' && mapSceneRef.current) {
          mapSceneRef.current.update(dt);
          // Check for Menu Open
          if (input.menu) {
            if (!menuSceneRef.current) {
              menuSceneRef.current = new MenuScene(() => {
                setGameState('MAP');
                menuSceneRef.current = null;
              });
            }
            setGameState('MENU');
          }
        } else if (gameState === 'BATTLE' && battleSceneRef.current) {
          battleSceneRef.current.update(dt);
        } else if (gameState === 'MENU' && menuSceneRef.current) {
          menuSceneRef.current.update(dt);
        }
      },
      (ctx) => {
        if (gameState === 'MAP' && mapSceneRef.current) {
          mapSceneRef.current.draw(ctx);
        } else if (gameState === 'BATTLE' && battleSceneRef.current) {
          battleSceneRef.current.draw(ctx);
        } else if (gameState === 'MENU' && menuSceneRef.current) {
          // Draw Map behind menu
          if (mapSceneRef.current) mapSceneRef.current.draw(ctx);
          menuSceneRef.current.draw(ctx);
        }
      }
    );

    loop.setCanvas(canvas);
    loop.start();
    gameLoopRef.current = loop;

    return () => {
      loop.stop();
    };
  }, [gameState]); // Re-create loop when state changes (or just keep one loop and toggle inside?)
  // Actually, re-creating the loop might be overkill, let's just keep one loop and use a ref for current game state if we want to avoid re-effects.
  // But for now, dependency on gameState is fine as it won't change every frame. 
  // Wait, if I change gameState, the effect re-runs, creating a NEW loop. That's safer for clean switching.

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#000'
    }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{
          border: '4px solid #fff',
          imageRendering: 'pixelated'
        }}
      />
    </div>
  );
}

export default App;
