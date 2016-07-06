# viilo

## Install

### 1. Get mongodb

#### OS X

`brew install mongodb`

Make your database directory, just incase you're not cool enough. #JSONLyfe Do you have read and write permissions? No. Well there ya' go sport.

`mkdir -p /data/db`

### 2. Get app dependencies

`npm install`

`bower install`

## Running dev server

Start mongo

`mongod`

In another terminal

`PORT=8080 gulp serve`

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
