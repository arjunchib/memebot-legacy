import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import ytdl from "ytdl-core";

ffmpeg.setFfmpegPath(ffmpegPath);

async function analyze(input, options) {
  const inputOptions = [];
  if (options.start) inputOptions.push(`-ss ${options.start}`);
  if (options.end) inputOptions.push(`-to ${options.end}`);
  const output = await new Promise((resolve, reject) => {
    ffmpeg(input)
      .noVideo()
      .inputOptions(inputOptions)
      .audioFilters("loudnorm=I=-23:LRA=7:tp=-2:print_format=json")
      .outputOptions(["-f null"])
      .on("error", (err) => reject(err))
      .on("end", (stdout, stderr) => resolve(stderr))
      .save("/dev/null");
  });
  const data = parseFFmpegOutput(output);
  return {
    duration: data.duration,
    loudness: {
      i: data.input_i,
      lra: data.input_lra,
      tp: data.input_tp,
      thresh: data.input_thresh,
      offset: data.target_offset,
    },
  };
}

async function transcode(input, output, options) {
  const outputOptions = [];
  const audioFilters = [];
  if (options.start) outputOptions.push(`-ss ${options.start}`);
  if (options.end) outputOptions.push(`-to ${options.end}`);
  if (options.loudness) {
    audioFilters.push(createLoudnessFilter(options.loudness));
  }
  const ffmpegOutput = await new Promise((resolve, reject) => {
    ffmpeg(input)
      .noVideo()
      .audioFilters(audioFilters)
      .outputOptions(outputOptions)
      .on("error", (err) => reject(err))
      .on("end", (stdout, stderr) => resolve(stderr))
      .save(output);
  });
  const data = parseFFmpegOutput(ffmpegOutput);
  return {
    duration: data.duration,
    loudness: {
      i: data.output_i,
      lra: data.output_lra,
      tp: data.output_tp,
      thresh: data.output_thresh,
    },
  };
}

const source = {
  youtube(url) {
    return ytdl(url, {
      filter: (format) => format.codecs === "opus",
      quality: "highestaudio",
    });
  },
};

function createLoudnessFilter(loudness) {
  return {
    filter: "loudnorm",
    options: {
      I: -23,
      LRA: 7,
      tp: -2,
      measured_I: Math.min(loudness.i, 0),
      measured_LRA: loudness.lra,
      measured_tp: loudness.tp,
      measured_thresh: loudness.thresh,
      offset: loudness.offset,
      print_format: "json",
    },
  };
}

function parseFFmpegOutput(output) {
  const duration = output.match(/Output #0,[\s\S]*?time=(?<duration>\S*?) /)
    .groups.duration;
  const lines = output.split("\n");
  const measured = JSON.parse(lines.slice(-13, -1).join("\n"));
  return { ...measured, duration };
}

export default { analyze, transcode, source };
