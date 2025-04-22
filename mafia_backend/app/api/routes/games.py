from fastapi import APIRouter, Depends, HTTPException, Body, Query
from sqlalchemy.ext.asyncio import AsyncSession
from db import schemas, crud, models
from api.dependencies import get_db
from typing import List
from core import game_logic, events

router = APIRouter()

@router.post("/", response_model=schemas.GameCreate)
async def create_game(game: schemas.GameCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_game(db=db, game=game)

@router.get("/", response_model=List[schemas.GameRead])
async def get_all_games(db: AsyncSession = Depends(get_db)):
    return await crud.get_games(db)

@router.post("/{game_id}/join")
async def join_game(game_id: int, player_game: schemas.PlayerGameCreate, db: AsyncSession = Depends(get_db)):
    player_game.game_id = game_id
    return await crud.add_player_to_game(db=db, player_game=player_game)

@router.post("/{game_id}/start")
async def start_game(game_id: int, db: AsyncSession = Depends(get_db)):
    try:
        await game_logic.start_game(db, game_id)
        return {"status": "started"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{game_id}/finish")
async def finish_game(game_id: int, db: AsyncSession = Depends(get_db)):
    try:
        await game_logic.finish_game(db, game_id)
        return {"status": "finished"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{game_id}/vote")
async def vote(
    game_id: int,
    voter_id: int = Body(..., embed=True),
    target_id: int = Body(..., embed=True)
):
    events.vote(game_id, voter_id, target_id)
    return {"status": "vote registered"}

@router.get("/{game_id}/tally")
async def tally_votes(game_id: int):
    results = events.tally_votes(game_id)
    if results:
        return results
    return {"detail": "No votes yet"}

@router.post("/{game_id}/phase")
async def tally_votes(
    game_id: int,
    phase: str = Query(...),  # или Body(...) если ты хочешь из тела запроса
    db: AsyncSession = Depends(get_db)
):
    await game_logic.set_phase(db, game_id, phase)
    return {"status": phase}

@router.post("/{game_id}/assign_roles")
async def assign_roles_route(game_id: int, db: AsyncSession = Depends(get_db)):
    try:
        await game_logic.assign_roles(db, game_id)
        return {"message": f"Roles successfully assigned for game {game_id}"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/{game_id}/players_with_roles")
async def get_players_and_roles(game_id: int, db: AsyncSession = Depends(get_db)):
    players = await game_logic.get_players_with_roles(db, game_id)
    return {"players": players}