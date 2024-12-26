const { parse } = require("csv-parse");

const processCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const records = [];

    parse(buffer, {
      columns: true,
      skip_empty_lines: true,
    })
      .on("data", (data) => records.push(data))
      .on("error", reject)
      .on("end", () => resolve(records));
  });
};

module.exports = { processCSV };
