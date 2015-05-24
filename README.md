# viilo

## Install

### 1. Get mongodb

#### OS X

`brew install mongodb`

### 2. pull down node modules

`npm install`

## Running server

Start mongo

`mongod`

In another terminal

`npm start`

## Running tests

Start mongo

`mongod`

In another terminal

`npm test`

## API

### GET /leaderboard

Players by elo rating

### GET /players

Players by name

### POST /players

Create a player

```json
{
  "name": "bob"
}
```

### GET /results

Results, most recent first

### POST /results

Report a game result

```json
{
  "winner": {
    "id": "...",
    "name": "..."
  },
  "loser": {
    "id": "...",
    "name": "..."
  }
}
```