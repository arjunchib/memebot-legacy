import ffmpeg from "fluent-ffmpeg";

export default async function (input, output, options = {}) {
  const outputOptions = ["-f ogg"];
  if (options.start) outputOptions.push(`-ss ${options.start}`);
  if (options.end) outputOptions.push(`-to ${options.end}`);

  const [, stderr] = await new Promise((resolve, reject) => {
    ffmpeg(input)
      .noVideo()
      .audioFilters("loudnorm=I=-23:LRA=7:tp=-2:print_format=json")
      .outputOptions(["-f null"])
      .on("error", (err) => reject(err))
      .on("end", (stdout, stderr) => resolve([stdout, stderr]))
      .save("/dev/null");
  });

  const lines = stderr.split("\n");
  const measured = JSON.parse(lines.slice(-13, -1).join("\n"));
  const filter = `loudnorm=I=-23:LRA=7:tp=-2:measured_I=${measured.input_i}:measured_LRA=${measured.input_lra}:measured_tp=${measured.input_tp}:measured_thresh=${measured.input_thresh}:offset=${measured.target_offset}:print_format=json`;

  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .noVideo()
      .audioFilters(filter)
      .outputOptions(outputOptions)
      .on("error", (err) => reject(err))
      .on("end", (stdout, stderr) => resolve([stdout, stderr]))
      .save(output);
  });
}
