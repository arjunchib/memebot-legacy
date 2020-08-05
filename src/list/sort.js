export default function ({ memes, args }) {
  let compareFn = (a, b) => a.name.toLowerCase() - b.name.toLowerCase();
  switch (args[1]) {
    case "shuffle":
      compareFn = () => Math.random() - 0.5;
      break;
    default: {
      const field = args[1];
      const order = args.length >= 3 && args[2] === "desc" ? -1 : 1;
      compareFn = (a, b) => {
        let output = 0;
        if (a[field] < b[field]) output = -1;
        else if (a[field] > b[field]) output = 1;
        return output * order;
      };
    }
  }
  return memes.sort(compareFn);
}
