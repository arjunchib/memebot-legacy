//import ffmpeg from "fluent-ffmpeg";
import transcode from "../src/util/transcode.js";
//import fs from "fs";

/*
ffmpeg("./data/audio/1off.mp3")
  .audioFilters("loudnorm=I=-23:LRA=7:tp=-2:print_format=json")
  .outputOptions(["-f null"])
  .on("error", console.error)
  .on("end", normalize)
  .save("/dev/null");

function normalize(stdout, stderr) {
  const lines = stderr.split("\n");
  const measured = JSON.parse(lines.slice(-13, -1).join("\n"));
  const filter = `loudnorm=I=-23:LRA=7:tp=-2:measured_I=${measured.input_i}:measured_LRA=${measured.input_lra}:measured_tp=${measured.input_tp}:measured_thresh=${measured.input_thresh}:offset=${measured.target_offset}`;
  ffmpeg("./data/audio/1off.mp3")
    .audioCodec("libopus")
    .audioFilters(filter)
    .outputOptions(["-f ogg"])
    .on("error", console.error)
    .on("end", console.log)
    .save("./data/audio/1off.opus");
}
*/

(async () => {
  console.log(
    ...(await transcode("./data/audio/1off.mp3", "./data/audio/1off.opus"))
  );
})();
