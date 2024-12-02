import { useState, useCallback } from 'react';
import { StoneColor } from '../types/game';

type Board = (StoneColor | null)[][];

export const useWebSocket = () => {
  const [board, setBoard] = useState<Board>(Array(19).fill(null).map(() => Array(19).fill(null)));
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    setIsConnected(true);
  }, []);

  const placeStone = useCallback((x: number, y: number) => {
    setBoard(prevBoard => {
      const newBoard = [...prevBoard.map(row => [...row])];
      newBoard[x][y] = 'BLACK'; // 임시로 항상 흑돌 놓기
      return newBoard;
    });
  }, []);

  return { board, isConnected, connect, placeStone };
}; 