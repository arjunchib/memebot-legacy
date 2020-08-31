import fs from "fs";
import AWS from "aws-sdk";
import mkdirp from "mkdirp";
import path from "path";

mkdirp.sync(process.env.DATA_DIR);

const s3 = new AWS.S3({
  endpoint: process.env.SPACES_ENDPOINT,
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
});

const local = {
  async save(key, data) {
    return await fs.promises.writeFile(this.path(key), data);
  },
  async load(key) {
    return await fs.promises.readFile(this.path(key), "utf8");
  },
  async remove(key) {
    return await fs.promises.unlink(this.path(key));
  },
  path(key) {
    return `${process.env.DATA_DIR}/${key}`;
  },
};

const remote = {
  async save(key, data) {
    let ContentType = "application/octet-stream";
    switch (path.extname(key)) {
      case ".json":
        ContentType = "application/json";
        break;
      case ".opus":
        ContentType = "audio/ogg; codecs=opus";
    }
    const params = {
      Bucket: "memebot",
      Key: this.key(key),
      Body: data,
      ACL: "public-read",
      ContentType,
    };
    return await s3.upload(params).promise();
  },
  async load(key) {
    const params = {
      Bucket: "memebot",
      Key: this.key(key),
    };
    return await s3.getObject(params).promise();
  },
  async remove(key) {
    var params = {
      Bucket: "memebot",
      Key: this.key(key),
    };
    return await s3.deleteObject(params).promise();
  },
  key(key) {
    return `${process.env.SPACES_PREFIX}/${key}`;
  },
};

async function save(key, data) {
  const json = JSON.stringify(data, null, 2);
  const localPromise = local.save(key, json);
  const remotePromise = remote.save(key, json);
  return await Promise.all([localPromise, remotePromise]);
}

async function load(key) {
  const data = await local.load(key);
  return JSON.parse(data);
}

async function loadAll(prefix) {
  const files = await fs.promises.readdir(`${process.env.DATA_DIR}/${prefix}`);
  const promises = files
    .filter((file) => file.endsWith(".json"))
    .map((file) => load(`${prefix}/${file}`));
  return await Promise.all(promises);
}

async function remove(key) {
  const localPromise = local.remove(key);
  const remotePromise = remote.remove(key);
  return await Promise.all([localPromise, remotePromise]);
}

export default { save, load, loadAll, remove, local, remote };
