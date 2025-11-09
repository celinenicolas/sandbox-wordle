export type GameState = 'NotStarted' | 'Playing' | 'Winner' | 'Loser';

export const GameStates = {
      NotStarted: 'NotStarted',
      Playing: 'Playing',
      Winner: 'Winner',
      Loser: 'Loser',
    } as const;