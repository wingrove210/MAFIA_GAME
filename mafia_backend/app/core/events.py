votes = {}

def vote(game_id: int, voter_id: int, target_id: int):
    if game_id not in votes:
        votes[game_id] = {}
    votes[game_id][voter_id] = target_id

def tally_votes(game_id: int):
    from collections import Counter
    target_counter = Counter(votes.get(game_id, {}).values())
    return [
        {"target_id": target_id, "votes": count}
        for target_id, count in target_counter.items()
    ]