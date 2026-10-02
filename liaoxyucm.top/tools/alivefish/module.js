function able2square(x/*: number */, y/*: number */) {
  return (x ** 2) < y
}

function alivefish_impl(text/*: string */) {
  let result /*: string */ = "";
  let cell /*: number */ = 0;

  text.split("").map((tx /*: string */) => (tx.charCodeAt(0))).forEach((target_cell /*: number */) => {
    if (target_cell < cell) {
      result += "d".repeat(cell - target_cell);
    } else {
      while (cell < 2) {
        result += "i";
        cell += 1;
      }
      while (able2square(cell, target_cell)) {
        result += "s";
        cell **= 2;
      }
      result += "i".repeat(target_cell - cell);
    }
    cell = target_cell;
    result += "o";
  });
  return result;
}