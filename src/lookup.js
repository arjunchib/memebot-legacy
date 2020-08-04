import fs from "fs";

const lookup = new Map(JSON.parse(fs.readFileSync("./data/lookup.json")));
export default lookup;
