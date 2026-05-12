export const zh = {
  appTitle: '小游戏',
  lobbyTitle: '大厅',
  headerBackTitle: '大厅',
  gameStackTitle: '游戏',
  gameNotFoundTitle: '未找到游戏',
  gameNotFoundBody: (id: string) =>
    `没有为「${id}」注册的游戏。请使用标题栏返回大厅。`,
  lobbySubtitle: '选择一个游戏开始',
  categoryLabels: {
    puzzle: '益智',
    arcade: '休闲',
    classic: '经典',
  } as const,
  notFoundScreenTitle: '页面不存在',
  notFoundMessage: '该页面不存在。',
  notFoundGoHome: '返回大厅',
  /** Optional per-game short hints (lobby or in-game may reference these). */
  gameHints: {
    snake: '在棋盘上滑动改变方向。',
    twenty48: '在棋盘上滑动合并方块。',
    minesweeper: '轻点翻开 · 长按插旗',
  } as const,
} as const;
