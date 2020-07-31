import fs from "fs";

export default async function (file, data, options = {}) {
  const json = options.pretty
    ? JSON.stringify(data, null, 2)
    : JSON.stringify(data);
  return await fs.promises.writeFile(file, json);
}
