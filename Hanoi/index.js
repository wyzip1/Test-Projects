
function hanoi(n, A, B, C) {
  if (n === 1) {
    move(A, C);
  } else {
    hanoi(n - 1, A, C, B);
    move(A, C);
    hanoi(n - 1, B, A, C)
  }
}

function move(origin, target) {
  console.log(origin + '->' + target);
}

hanoi(64, 'A', 'B', 'C');