import fs from "fs";

const lookup = new Map(JSON.parse(fs.readFileSync("./lookup.json")));
export default lookup;
