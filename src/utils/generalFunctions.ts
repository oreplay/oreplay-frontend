/**
 * Returns the element in the array that produces the highest value from the given key function.
 *
 * The key function is evaluated exactly once per element. If multiple elements
 * share the same maximum key value, the first one encountered is returned.
 *
 * @template T
 * @param {T[]} array - The array of elements to evaluate. Must not be empty.
 * @param {(item: T) => number} key - A function that maps each element to a numeric value used for comparison.
 * @returns {T} The element with the maximum computed key value.
 *
 * @throws {TypeError} If the array is empty.
 *
 * @example
 * const data = [
 *   { name: "A", value: 10 },
 *   { name: "B", value: 30 },
 *   { name: "C", value: 20 },
 * ];
 *
 * const result = maxBy(data, (x) => x.value);
 * // result => { name: "B", value: 30 }
 *
 * @example
 * // Works with primitive values
 * const result = maxBy([1, 5, 3], (x) => x);
 * // result => 5
 *
 * @example
 * // When multiple elements have the same max key, the first is returned
 * const result = maxBy(
 *   [{ v: 10 }, { v: 10 }],
 *   (x) => x.v
 * );
 * // result => { v: 10 } (first element)
 **/
export function maxBy<T>(array: T[], key: (item: T) => number): T {
  return array
    .map((item) => ({ item, key: key(item) }))
    .reduce((max, curr) => (curr.key > max.key ? curr : max)).item
}
