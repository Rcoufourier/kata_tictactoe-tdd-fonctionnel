import { getDiagonalsMatrix, inverseMatrix } from "./utils";

export type Game = {
  grid: Cell[][],
  isOver?: boolean,
  nextPlayer : PlayerMark
};

const PlayerMarkPosibility = ["X", "O"] as const;
type PlayerMark = typeof PlayerMarkPosibility[number] ;

type Cell = PlayerMark | "";

interface Position {
  row: 0 | 1 |2
  column: 0 | 1 | 2
}

const isPlayerTurn = (game :Game) => (symbol: PlayerMark):boolean => {
  return game.nextPlayer === symbol
};

const isFieldAvailable  = (game: Game) => (pos: Position):boolean => {
  const gridPosX = pos.row ;
  const gridPosY = pos.column;
  return game.grid[gridPosX][gridPosY] === ""
};

const verifyBySymbol = (game: Game) => (symbol: PlayerMark):boolean => {
  return (
    // verifyRowBySymbol(game.grid)("X" || "O") ||
    verifyRowBySymbol(game.grid)(symbol) ||
    verifyRowBySymbol(inverseMatrix(game.grid))(symbol) ||
    verifyRowBySymbol(getDiagonalsMatrix(game.grid))(symbol)
  )
}

const verifyRowBySymbol = (grid: Cell[][]) => (symbol: PlayerMark):boolean =>{
 return grid.reduce<boolean>(verifyReducer(symbol), false)
};

const verifyReducer = (symbol: PlayerMark) => (acc : boolean, cur :  Cell[]) => {
  return acc || cur.reduce(verifyRowBySymbolReducer(symbol),true);
};

const verifyRowBySymbolReducer = (symbol: PlayerMark) => {
  return (acc : boolean, cur : Cell) => {
    const isCurrentCellValid = cur === symbol;
    return acc && isCurrentCellValid;
  };
};

const play = (game :Game) => (position: Position) => (player : PlayerMark): Game => {
  if (!isPlayerTurn(game)(player) || !isFieldAvailable(game)(position)){
    return game
  }
 const nextGrid = setCellPosition(game.grid)(position)(player)
 const nextPlayer = otherPlayer(player)
 const gameStatus = verifyBySymbol(game)(player)

  return {
    grid: nextGrid,
    isOver: gameStatus,
    nextPlayer: nextPlayer
  };
}

const otherPlayer = (player : PlayerMark) : PlayerMark => {
    switch(player)  {
    case  "X":
      return "O"
    case  "O":
      return "X"
  }
}

const setCellPosition = (grid :Cell[][]) => (position : Position) => (player :PlayerMark ):Cell[][] => {
  const nextGrid = grid;
  nextGrid[position.row][position.column] = player;
  return nextGrid
}
test("a field can be taken", function() {
  const game: Game = {
    grid: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ],
    nextPlayer: "O"
  };
  const position: Position = {
    row: 1,
    column: 1
  };
  expect(isFieldAvailable(game)(position)).toEqual(true);
});
test("a field cant be taken", function() {
  const game: Game = {
    grid: [
      ["X", "", ""],
      ["", "", ""],
      ["", "", ""]
    ],
    nextPlayer: "O"
  };
  const position: Position = {
    row: 0,
    column: 0
  };
  expect(isFieldAvailable(game)(position)).toEqual(false);
});
test("a field cant be taken in other position", function() {
  const game: Game = {
    grid: [
      ["", "", ""],
      ["", "X", ""],
      ["", "", ""]
    ],
    nextPlayer: "O"
  };
  const position: Position = {
    row:1,
    column: 1
  };
  expect(isFieldAvailable(game)(position)).toEqual(false);
});
test("first row full with X", function() {
  const game: Game = {
    grid: [
      ["X", "X", "X"],
      ["", "", ""],
      ["", "", ""]
    ],
    nextPlayer: "O"
  };

  expect(verifyBySymbol(game)("X")).toEqual(true);
});
test("first row is not full with same symbol X", function() {
  const game: Game = {
    grid: [
      ["X", "", "X"],
      ["", "", ""],
      ["", "", ""]
    ],
    nextPlayer: "O"
  };
  expect(verifyBySymbol(game)("X")).toEqual(false);
});
test("first row full with O", function() {
  const game: Game = {
    grid: [
      ["O", "O", "O"],
      ["", "", ""],
      ["", "", ""]
    ],
    nextPlayer: "O"
  };

  expect(verifyBySymbol(game)("O")).toEqual(true);
});
test("Second row full with O", function() {
  const game: Game = {
    grid: [
      ["", "", ""],
      ["O", "O", "O"],
      ["", "", ""]
    ],
    nextPlayer: "O"
  };

  expect(verifyBySymbol(game)("O")).toEqual(true);
});
test("Test column full of O",function() {

  const game: Game = {
    grid: [
      ["O", "", ""],
      ["O", "", ""],
      ["O", "", ""]
    ],
    nextPlayer: "O"
  };
  expect(verifyBySymbol(game)("O")).toEqual(true);
});
test("Test column full of X",function() {

  const game: Game = {
    grid: [
      ["X", "", ""],
      ["X", "", ""],
      ["X", "", ""]
    ],
    nextPlayer: "O"
  };
  expect(verifyBySymbol(game)("X")).toEqual(true);
});
test("Test column full of X on column 2",function() {

  const game: Game = {
    grid: [
      ["", "X", ""],
      ["", "X", ""],
      ["", "X", ""]
    ],
    nextPlayer: "O"
  };
  expect(verifyBySymbol(game)("X")).toEqual(true);
});
test("Test column full of X on column 2",function() {

  const game: Game = {
    grid: [
      ["X", "", ""],
      ["", "X", ""],
      ["", "", "X"]
    ],
    nextPlayer: "O"
  };
  expect(verifyBySymbol(game)("X")).toEqual(true);
});
test("Test column full of X on column 2",function() {

  const game: Game = {
    grid: [
      ["", "", "O"],
      ["", "O", ""],
      ["O", "", ""]
    ],
    nextPlayer: "X"
  };
  expect(verifyBySymbol(game)("O")).toEqual(true);
});
test("Test column full of X on column 2",function() {

  const game: Game = {
    grid: [
      ["O", "", "O"],
      ["", "", ""],
      ["O", "", "O"]
    ],
    nextPlayer: "O"
  };
  expect(verifyBySymbol(game)("O")).toEqual(false);
});
test("test player turn", function(){
const game :Game= {
  grid: [
    ["O", "", "O"],
    ["", "", ""],
    ["O", "", "O"]
  ],
  nextPlayer: "O"
  };
  expect(isPlayerTurn(game)("O")).toEqual(true);
});
test("return the other player mark", function() {
  expect(otherPlayer("O")).toEqual("X");
  expect(otherPlayer("X")).toEqual("O");
});
test("test  play a turn successfully", function(){
  const game :Game= {
    grid: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ],
    nextPlayer: "O"
  };
  const expected :Game = {
    grid: [
      ["", "", ""],
      ["", "O", ""],
      ["", "", ""]
    ],
    isOver: false,
    nextPlayer: "X"
  };
  
  const pos :Position = {
    row: 1,
    column: 1
  } 
  
  expect(play(game)(pos)("O")).toEqual(expected);
});
test("test  is not player turn", function(){
  const game :Game= {
    grid: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ],
    nextPlayer: "O"
  };

  const pos :Position = {
    row: 1,
    column: 1
  }

  expect(play(game)(pos)("X")).toEqual(game);
});
test("test  cell not available", function(){
  const game :Game= {
    grid: [
      ["", "", ""],
      ["", "X", ""],
      ["", "", ""]
    ],
    nextPlayer: "O"
  };

  const pos :Position = {
    row: 1,
    column: 1
  }

  expect(play(game)(pos)("O")).toEqual(game);
});
test("test set Cell position", function(){
  const game :Game= {
    grid: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ],
    nextPlayer: "X"
  };
  const position :Position = {
    row: 1,
    column: 1
  }

  const expected :Cell[][]=
    [
      ["", "", ""],
      ["", "X", ""],
      ["", "", ""]
    ]

  expect(setCellPosition(game.grid)(position)("X")).toEqual(expected)
});