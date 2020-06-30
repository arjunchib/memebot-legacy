export default function ({ memes, args }) {
  const field = args[1];
  const order = args.length >= 3 && args[2] === "desc" ? -1 : 1;
  const compareFn = (a, b) => {
    let output = 0;
    if (a[field] < b[field]) output = -1;
    else if (a[field] > b[field]) output = 1;
    return output * order;
  };
  return memes.sort(compareFn);
}
