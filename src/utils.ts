export const inverseMatrix = (matrix : any[][]) => {
  return matrix.reduce(
    (acc, cv)=> {
      cv.reduce(
        (acc2, cv2, idx2)=> {
          if(acc[idx2]==undefined) acc[idx2]=[];
          acc[idx2].push(cv2);
        },[]
      );
      return acc;
    },[]
  );
}

export function getDiagonalsMatrix<Type>(matrix : Type[][]): Type[][] {
  return [
    [matrix[0][0], matrix[1][1], matrix[2][2]],
    [matrix[0][2], matrix[1][1], matrix[2][0]]
  ]
}
