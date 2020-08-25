import fs from "fs";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  endpoint: process.env.SPACES_ENDPOINT,
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
});

export async function write(key, data) {
  return await fs.promises.writeFile(`${process.env.DATA_DIR}/${key}`, data);
}

export async function read(key) {
  return await fs.promises.readFile(`${process.env.DATA_DIR}/${key}`, "utf8");
}

export async function upload(key, data) {
  const params = {
    Bucket: "memebot",
    Key: `${process.env.SPACES_PREFIX}/${key}`,
    Body: data,
    ACL: "public-read",
  };
  return await s3.upload(params).promise();
}

export async function download(key) {
  const params = {
    Bucket: "memebot",
    Key: `${process.env.SPACES_PREFIX}/${key}`,
  };
  return await s3.getObject(params).promise();
}

export async function save(key, data) {
  const json = JSON.stringify(data, null, 2);
  const writePromise = write(key, json);
  const uploadPromise = upload(key, json);
  return await Promise.all([uploadPromise, writePromise]);
}

export async function load(key) {
  const data = await read(key);
  return JSON.parse(data);
}

export async function loadAll(prefix) {
  const files = await fs.promises.readdir(`${process.env.DATA_DIR}/${prefix}`);
  const promises = files
    .filter((file) => file.endsWith(".json"))
    .map((file) => load(`${prefix}/${file}`));
  return await Promise.all(promises);
}
