import { addItem, getSrNoToStartFrom } from "./notion.js";
import { processRow } from "./helper.js";
import Data from "./getpaytmdata.js";

var SrNo = await getSrNoToStartFrom();
console.log(SrNo);
Data.forEach((row) => {
	var newrow = processRow(row, SrNo);
	console.log(newrow);
	// addItem(newrow);
	SrNo += 1;
});
