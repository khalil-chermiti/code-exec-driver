function flatten(array) {
  // Check if the input array is empty
  if (array.length === 0) {
    return [];
  }

  // Use reduce to flatten the array
  return array.reduce((acc, cur) => acc.concat(cur), []);
}
