import type { GameDefinition } from './types';
import { BreakoutScreen } from './breakout/BreakoutScreen';
import { ExampleGameScreen } from './example/ExampleGameScreen';
import { MemoryScreen } from './memory/MemoryScreen';
import { MinesweeperScreen } from './minesweeper/MinesweeperScreen';
import { SimonScreen } from './simon/SimonScreen';
import { SnakeScreen } from './snake/SnakeScreen';
import { Twenty48Screen } from './twenty48/Twenty48Screen';
import { TicTacToeScreen } from './tictactoe/TicTacToeScreen';

export const games: GameDefinition[] = [
  {
    id: 'twenty48',
    title: '2048',
    description: '滑动合并数字，挑战更高分。',
    icon: 'apps-outline',
    category: 'puzzle',
    component: Twenty48Screen,
  },
  {
    id: 'reaction-time',
    title: '反应速度',
    description: '看到目标后尽快点击，测一测反应时间。',
    icon: 'flash',
    category: 'arcade',
    component: ExampleGameScreen,
  },
  {
    id: 'snake',
    title: '贪吃蛇',
    description: '控制方向吃食物变长，别撞墙或咬到自己。',
    icon: 'analytics-outline',
    category: 'arcade',
    component: SnakeScreen,
  },
  {
    id: 'minesweeper',
    title: '扫雷',
    description: '翻开安全格，用旗标出雷区。',
    icon: 'flag-outline',
    category: 'classic',
    component: MinesweeperScreen,
  },
  {
    id: 'tictactoe',
    title: '井字棋',
    description: '与电脑对战，连成一线即胜。',
    icon: 'grid-outline',
    category: 'classic',
    component: TicTacToeScreen,
  },
  {
    id: 'memory',
    title: '记忆翻牌',
    description: '翻牌配对相同字母，用的步数越少越好。',
    icon: 'layers-outline',
    category: 'puzzle',
    component: MemoryScreen,
  },
  {
    id: 'breakout',
    title: '打砖块',
    description: '拖动挡板弹球打砖块，别让小球落下。',
    icon: 'tennisball-outline',
    category: 'arcade',
    component: BreakoutScreen,
  },
  {
    id: 'simon',
    title: '西蒙说',
    description: '记住灯光顺序并依次点击，回合越来越长。',
    icon: 'musical-notes-outline',
    category: 'classic',
    component: SimonScreen,
  },
];

export function getGameById(id: string): GameDefinition | undefined {
  return games.find((g) => g.id === id);
}
