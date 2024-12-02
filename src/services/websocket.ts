import { GameState } from '../types/game';

class WebSocketService {
  private ws: WebSocket | null = null;
  private onGameStateChange: (gameState: GameState) => void;

  constructor(onGameStateChange: (gameState: GameState) => void) {
    this.onGameStateChange = onGameStateChange;
  }

  connect() {
    this.ws = new WebSocket('ws://localhost:8000/ws');

    this.ws.onopen = () => {
      console.log('Connected to server');
    };

    this.ws.onmessage = (event) => {
      const gameState = JSON.parse(event.data);
      this.onGameStateChange(gameState);
    };

    this.ws.onclose = () => {
      console.log('Disconnected from server');
      this.ws = null;
    };
  }

  placeStone(row: number, col: number) {
    if (!this.ws) return;

    this.ws.send(JSON.stringify({
      type: 'PLACE_STONE',
      row,
      col
    }));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  sendMove(x: number, y: number) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'move',
        data: { x, y }
      }));
    }
  }
}

// 싱글톤 인스턴스 생성
const webSocketService = new WebSocketService((gameState: GameState) => {
  // 게임 상태 변경 핸들러 구현
});

export default webSocketService;  // 클래스 대신 인스턴스를 내보냄