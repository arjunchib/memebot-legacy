import ffmpeg from "fluent-ffmpeg";

ffmpeg("./data/audio/1off.opus")
  .audioFilters("loudnorm=I=-23:LRA=7:tp=-2:print_format=json")
  .outputOptions(["-f null"])
  .on("error", console.error)
  .on("end", console.log)
  .save("/dev/null");
