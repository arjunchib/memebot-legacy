import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import stream from "stream";
import store from "./store.js";

function parseOutput(output) {
  const duration = output.match(/Duration: (?<duration>.*?),/).groups.duration;
  const lines = output.split("\n");
  const measured = JSON.parse(lines.slice(-13, -1).join("\n"));
  return { ...measured, duration };
}

const tempPath = store.local.path("temp");

export default async function (input, output, options = {}) {
  const isStream = input instanceof stream.Readable;
  const outputOptions = ["-f ogg"];
  if (options.start) outputOptions.push(`-ss ${options.start}`);
  if (options.end) outputOptions.push(`-to ${options.end}`);

  if (isStream) {
    await input.pipe(fs.createWriteStream(tempPath));
  }

  const output1 = await new Promise((resolve, reject) => {
    ffmpeg(input)
      .noVideo()
      .audioFilters("loudnorm=I=-23:LRA=7:tp=-2:print_format=json")
      .outputOptions(["-f null"])
      .on("error", (err) => reject(err))
      .on("end", (stdout, stderr) => resolve(stderr))
      .save("/dev/null");
  });

  const data1 = parseOutput(output1);
  const measured_i = Math.min(data1.input_i, 0);
  const filter = `loudnorm=I=-23:LRA=7:tp=-2:measured_I=${measured_i}:measured_LRA=${data1.input_lra}:measured_tp=${data1.input_tp}:measured_thresh=${data1.input_thresh}:offset=${data1.target_offset}:print_format=json`;

  const output2 = await new Promise((resolve, reject) => {
    ffmpeg(isStream ? tempPath : input)
      .noVideo()
      .audioFilters(filter)
      .outputOptions(outputOptions)
      .on("error", (err) => reject(err))
      .on("end", (stdout, stderr) => resolve(stderr))
      .save(output);
  });

  const data2 = parseOutput(output2);
  await fs.promises.unlink(tempPath);

  return {
    duration: data2.duration,
    loudness: {
      i: data2.output_i,
      lra: data2.output_lra,
      tp: data2.output_tp,
      thresh: data2.output_thresh,
    },
  };
}
