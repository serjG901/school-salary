export default function numTruncAfterZero(num, numberAfterZero) {
  const arr = (num + "").split(".");
  if (arr.length === 1) return arr[0];
  return arr[0] + "." + arr[1].slice(0, numberAfterZero);
}
