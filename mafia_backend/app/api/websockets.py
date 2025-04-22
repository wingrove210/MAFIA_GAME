from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List

router = APIRouter()

active_connections: Dict[int, List[WebSocket]] = {}

async def broadcast(game_id: int, message: dict):
    if game_id in active_connections:
        for connection in active_connections[game_id]:
            await connection.send_json(message)

@router.websocket("/ws/{game_id}")
async def websocket_endpoint(websocket: WebSocket, game_id: int):
    await websocket.accept()
    if game_id not in active_connections:
        active_connections[game_id] = []
    active_connections[game_id].append(websocket)

    try:
        while True:
            data = await websocket.receive_json()
            # Можно обрабатывать действия игрока тут, например: голос, выбор роли и т.д.
            print(f"[Game {game_id}] Received action: {data}")
    except WebSocketDisconnect:
        active_connections[game_id].remove(websocket)