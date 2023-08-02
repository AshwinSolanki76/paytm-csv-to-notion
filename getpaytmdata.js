import csv from "csvtojson";

// todo Change the below filename as needed
const csvFilePath = "all.csv";
const Data = await csv().fromFile(csvFilePath);

export default Data;
