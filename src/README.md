# Mega Tic Tac Toe (Ultimate Tic Tac Toe) – React + WebSocket Scaffold

This project is a scaffold for a real-time, multiplayer **Ultimate Tic Tac Toe** ("Mega Tic Tac Toe") game, built in React (plain JS/JSX) with WebSocket-based sync.

> **Ultimate Tic Tac Toe** is played on a 9x9 board divided into nine 3x3 sub-boards. Each move determines the board for the opponent's next move, creating deep strategy and unique gameplay.  
> [Rules: Wikipedia – Ultimate Tic Tac Toe](https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe)

---

## Features

- **Real-Time Multiplayer:**  
  Uses a single WebSocket connection for all room and move events.
- **9 Small Boards:**  
  3x3 grid of sub-boards. Each sub-board is a classic tic-tac-toe.
- **Rule Enforcement:**  
  - After the first move, each move at cell `i` in a sub-board sends the opponent to sub-board `i`.
  - If the destination board is won/tied/full, the opponent can play in any available board.
  - Sub-boards are marked as won/tied and locked if completed.
  - The main board (meta-board) is won by capturing 3 sub-boards in a row.
- **Spectator Mode:**  
  Support for non-playing observers (basic scaffolding).
- **Snappy UI:**  
  Optimistic updates for immediate feedback.
- **Componentized:**  
  Clean React separation: Lobby, GameBoard, SubBoard, Cell, and useWebSocket hook.
- **Styled:**  
  Example CSS classes for layout and active/inactive board feedback.

---

## Project Structure

```
src/
  index.js         # Entry point; renders <App />
  App.js           # Top-level state; manages WebSocket, lobby/game switch
  components/
    Lobby.js       # Room creation/join UI
    GameBoard.js   # 3x3 grid of sub-boards
    SubBoard.js    # Single 3x3 sub-board
    Cell.js        # Single cell in a board
  hooks/
    useWebSocket.js # Custom React hook for WebSocket connection
  styles/
    ...            # (Not included) MegaBoard.css, SubBoard.css, etc.
```

---

## Key Implementation Details

### WebSocket Hook

- `src/hooks/useWebSocket.js`
- Connects/disconnects on mount/unmount.
- Broadcasts and receives JSON messages.
- Usage:  
  ```js
  const { send } = useWebSocket(url, onMessage);
  send({ type: "move", ... });
  ```

### Game State

- **Boards:**  
  `boards = [ [9], [9], ..., [9] ]` (9 arrays of 9 cells each: 'X', 'O', or null)
- **Active Board Tracking:**  
  `nextBoard` = index (0-8) or null (any board allowed)
- **Turn Tracking:**  
  `xIsNext`: boolean

### Room Flow

1. **Create/Join Room:**  
   - Lobby UI triggers WebSocket messages (`createRoom`, `joinRoom`)
   - Server responds with `roomCreated`, `joinSuccess`, etc.
2. **Game View:**  
   - Board state and turn managed in React
   - Moves sent to server and applied to both clients
   - Spectators receive board updates

### Move Flow

- Clickable cells are enabled only if:
  - On the active board (or any, if `nextBoard` is null)
  - Cell is not occupied
  - It's the player's turn
- After move:
  - Update board state
  - Compute next active sub-board (unless it's full/won, then free choice)
  - Toggle turn

### UI/UX (Sample CSS Classes)

- `.mega-board` – Outer grid
- `.sub-board` – Each 3x3 board (disabled if not active)
- `.cell` – Grid cells (disabled if not clickable)
- `.disabled` – Gray out/lock completed or inactive boards

---

## Quick Start

1. **Install dependencies:**
   ```
   npm install
   ```
2. **Start your WebSocket server:**  
   (You must provide your own server at e.g. `ws://localhost:4000`)
3. **Run the React app:**
   ```
   npm start
   ```
4. **Open two browser tabs and join the same room to play.**

---

## References

- [Ultimate Tic Tac Toe (Wikipedia)](https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe)
- [React WebSocket Guide (ably.com)](https://ably.com/blog/websockets-react-tutorial)
- [WebSocket in React (maybe.works)](https://maybe.works/blogs/react-websocket)

---

## License

MIT
