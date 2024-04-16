// @ts-nocheck
function add(a, b) {
  // write your code here
  return a + b;
}

const a = process.argv[2];
const b = process.argv[3];

const result = add(parseInt(a), parseInt(b));

process.stdout.write(result.toString());
