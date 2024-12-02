import styled from 'styled-components';
import boardImg from '../assets/walnut.jpg';
import blackStoneImg from '../assets/black.png';
import whiteStoneImg from '../assets/white.png';
import { useState } from 'react';

const BOARD_SIZE = 19;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const BoardContainer = styled.div`
  width: 90vmin; /* 화면 크기에 따라 동적으로 크기 설정 */
  height: 90vmin;
  max-width: 900px; /* 최대 크기 */
  max-height: 900px;
  position: relative;
  background-image: url(${boardImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 2px solid black;
  border-radius: 10px;
`;

const GridContainer = styled.div`
  position: absolute;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  display: grid;
  grid-template-columns: repeat(19, 1fr);
  grid-template-rows: repeat(19, 1fr);
  overflow: hidden;
`;
const Cell = styled.div<{
  $isFirstRow?: boolean;
  $isLastRow?: boolean;
  $isFirstCol?: boolean;
  $isLastCol?: boolean;
  $isStarPoint?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  /* 가로선 */
  &::before {
    content: '';
    position: absolute;
    width: ${({ $isLastCol }) => ($isLastCol ? '50%' : '100%')};
    height: 1px;
    background: black;
    top: 50%;
    transform: translateY(-50%);
    left: ${({ $isFirstCol }) => ($isFirstCol ? '50%' : '0')};
  }

  /* 세로선 */
  &::after {
    content: '';
    position: absolute;
    height: ${({ $isLastRow }) => ($isLastRow ? '50%' : '100%')};
    width: 1px;
    background: black;
    left: 50%;
    transform: translateX(-50%);
    top: ${({ $isFirstRow }) => ($isFirstRow ? '50%' : '0')};
  }

  /* 화점, 성점, 천원 */
  ${({ $isStarPoint }) =>
    $isStarPoint &&
    `
      &::before {
        content: '●';  // 또는 '●'
        position: absolute;
        font-size: 1.2em;  // 부모 요소 폰트 크기의 50%
        line-height: 0;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;  // 텍스트 중앙 정렬
        z-index: 1;
      }

      &::after {
        content: '';
      }

      
    `}
`;

const Stone = styled.img`
  width: 95%;
  height: 95%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

type StoneType = null | 1 | 2;  // 0: 빈칸, 1: 흑돌, 2: 백돌

interface MoveResponse {
  status: string;
  board: StoneType[][];
  next_player: 1 | 2;
}

function GoBoard() {
  const [board, setBoard] = useState<StoneType[][]>(
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  
  const isStarPoint = (row: number, col: number) => {
    // 천원 (중앙점)
    if (row === 9 && col === 9) return true;
    
    // 화점 (3-3 교차점)
    if ((row === 3 && col === 3) || 
        (row === 3 && col === 15) || 
        (row === 15 && col === 3) || 
        (row === 15 && col === 15)) return true;
    
    // 성점 (4-4 교차점)
    if ((row === 3 && col === 9) || 
        (row === 9 && col === 3) || 
        (row === 9 && col === 15) || 
        (row === 15 && col === 9)) return true;
    
    return false;
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const handleCellClick = async(row: number, col: number) => {
    
    if (board[row][col]) return;

    try {
      console.log('Attempting API call to:', `${API_URL}/move`);
      const response = await fetch(`${API_URL}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          row: row + 1,
          col: col + 1,
          // 필요하다면 현재 플레이어 정보도 포함
          // player: currentPlayer
        })
      });
      console.log('Response status:', response); // 응답 상태 확인
      if (!response.ok) {
        throw new Error('Invalid move');
      }
      
      const data = await response.json();
      console.log('Move response:', data);
      setBoard(data.board);
      setCurrentPlayer(data.next_player);
    } catch (error) {
      console.error('Error making move:', error);
      alert('유효하지 않은 수입니다.');
      
    };
  };

  const renderStone = (stone: StoneType) => {
    if (stone === null) return null;
    return (
      <Stone 
        src={stone === 1 ? blackStoneImg : whiteStoneImg} 
        alt={`${stone === 1 ? 'black' : 'white'} stone`} 
      />
    );
  };

  return (
    <Wrapper>
      <BoardContainer>
        <GridContainer>
          {Array(BOARD_SIZE).fill(null).map((_, rowIndex) => (
            Array(BOARD_SIZE).fill(null).map((_, colIndex) => (
              <Cell 
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                $isFirstRow={rowIndex === 0}
                $isLastRow={rowIndex === BOARD_SIZE - 1}
                $isFirstCol={colIndex === 0}
                $isLastCol={colIndex === BOARD_SIZE - 1}
                $isStarPoint={isStarPoint(rowIndex, colIndex)}
              >
                {renderStone(board[rowIndex][colIndex])}
              </Cell>
            ))
          ))}
        </GridContainer>
      </BoardContainer>
    </Wrapper>
  );
}

export default GoBoard;