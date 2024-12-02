export type StoneColor = 'BLACK' | 'WHITE';
export type Board = Array<Array<StoneColor | null>>;

export interface GameState {
  board: Board;
  currentPlayer: StoneColor;
  // 추가적인 게임 상태가 필요하다면 여기에 작성
} 