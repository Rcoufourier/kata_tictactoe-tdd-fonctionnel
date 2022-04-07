import { getDiagonalsMatrix, inverseMatrix } from "./utils";
import { Game } from "./index.spec";

test("Test invert Matrix",function() {
  const game: Game = {
    grid: [
      ["O", "", ""],
      ["O", "", ""],
      ["O", "", ""]
    ]
  };

  const expectedGame  = {
    grid : [
      ["O", "O", "O"],
      ["", "", ""],
      ["", "", ""]
    ]
  }

  expect(inverseMatrix(game.grid)).toEqual(expectedGame.grid);
})


test("Test get diagonal Matrix",function() {
  const game: Game = {
    grid: [
      ["O", "", "X"],
      ["", "O", ""],
      ["X", "", "O"]
    ]
  };

  const diagonals  =  [
      ["O", "O", "O"],
      ["X", "O", "X"]
    ]

  expect(getDiagonalsMatrix(game.grid)).toEqual(diagonals);
})

