# Semanttuli

A daily semantic guessing game (Finnish Semanttuli, English Meaningle): everyone who shares a language is chasing the same Secret word that day.

## Language

**Secret word**:
The word all players of one language share for that calendar day (the day rolls at 00:00 UTC+3).
_Avoid_: answer, target, solution

**Guess**:
One attempt at the Secret word. It has a similarity to the Secret word and a Rank.
_Avoid_: try, attempt

**Rank**:
How close a Guess is to the Secret word: its percentile among the nearest 1000 words, or none if it is outside that set.
_Avoid_: place, position, standing

**Hint**:
A Guess the game inserts rather than the player typing it.

**Win**:
The player guessed the Secret word.

**Give-up**:
The player ended the day without a Win.
_Avoid_: forfeit, quit, surrender, lose

**Abandoned**:
A game still in progress when the day rolled over.
_Avoid_: forfeit, give-up

**Result**:
An opt-in snapshot of one finished day's play, stored only until the next day, with no Account behind it.
_Avoid_: account, user, profile, score, submission

**Leaderboard**:
Today's ordered list of Results for one language. Finnish and English never mix.
_Avoid_: scoretable, scoreboard

**Place**:
A Result's position on the Leaderboard.
_Avoid_: rank

**Name**:
The label on a Result. Chosen Names are unique for that language and day (compared trimmed and case-insensitive). Empty means Anonymous; the Anonymous label cannot be chosen.
_Avoid_: username, handle, nickname, account name

**Anonymous**:
A Result with no chosen Name. Many Results on the same Leaderboard may be Anonymous.
