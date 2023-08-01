import { Client } from "@notionhq/client";
import csv from "csvtojson";
import fs from "fs";
// import { dotenv } from "dotenv";
import pkg from "dotenv";
const { dotenv } = pkg;

pkg.config();
console.log(process.env.NOTION_TOKEN);
const notion = new Client({
	auth: process.env.NOTION_TOKEN,
	timeout: 120000,
});
const databaseId = process.env.DB_ID;

async function addItem(row) {
	try {
		const response = await notion.pages.create({
			parent: { database_id: databaseId },
			properties: {
				title: {
					title: [
						{
							text: {
								content: row.SrNo,
							},
						},
					],
				},
				Amount: {
					number: row.amount,
				},
				Date: {
					date: {
						start: row.date, // The date should be in YYYY-MM-DD format
					},
				},
				Method: {
					multi_select: [
						{
							name: "🏛 Paytm Bank",
						},
					],
				},
				DayName: {
					select: {
						name: row.dayName,
					},
				},
				Day: {
					select: {
						name: row.day,
					},
				},
				Month: {
					select: {
						name: row.month,
					},
				},
			},
		});
		console.log(response);
		console.log("Success! Entry added.");
	} catch (error) {
		var ErrorData = {};
		ErrorData.error = error;
		ErrorData.row = row;
		console.error(error.body);
		fs.appendFile("./Errors.json", JSON.stringify(ErrorData, null, 2), "utf-8");
	}
}

function getDateDetails(DateString) {
	// Step 1: Split the input string into date and time parts
	const inputString = DateString;
	const [datePart, timePart] = inputString.split(" ");

	// Step 2: Split the date part into day, month, and year
	const [day, month, year] = datePart.split("-");
	const monthMap = {
		1: "January",
		2: "February",
		3: "March",
		4: "April",
		5: "May",
		6: "June",
		7: "July",
		8: "August",
		9: "September",
		10: "October",
		11: "November",
		12: "December",
	};
	// Step 3: Create a new Date object using the extracted values
	const dateObject = new Date(`${year}-${month}-${day}T${timePart}`);

	// Step 4: Extract the date in the desired format "YYYY-MM-DD"
	const formattedDate = dateObject.toISOString().split("T")[0];
	// Get the name of the day
	const options = { weekday: "long" };
	const dayName = dateObject.toLocaleString("en-US", options);
	var dateDetails = {};
	dateDetails.dayName = dayName;
	dateDetails.day = day;
	dateDetails.month = monthMap[parseInt(month)];
	dateDetails.year = year;
	dateDetails.formattedDate = formattedDate;
	return dateDetails;
}

// Replace 'Sr. No.' with the name of your custom property that represents the identifier

async function getHighestSrNoPage() {
	try {
		const response = await notion.databases.query({
			database_id: databaseId,
			sorts: [
				// Sort by the 'Sr. No.' property in descending order (highest to lowest)
				{
					property: "Number",
					direction: "descending",
				},
			],
		});

		// The 'results' property contains an array of pages in the database, sorted by 'Sr. No.'
		const highestSrNoPage = response.results[0];
		console.log("#################################");
		console.log(highestSrNoPage.properties.Number.formula.number);
		return highestSrNoPage.properties.Number.formula.number;
	} catch (error) {
		console.error("Error fetching pages:", error);
		return null;
	}
}

var response = await notion.databases.query({
	database_id: databaseId,
});

var SrNo = ((await getHighestSrNoPage()) + 1).toString();
const csvFilePath = "all.csv";
csv()
	.fromFile(csvFilePath)
	.then((jsonObj) => {
		jsonObj.forEach((row) => {
			var newrow = {};
			newrow.amount =
				row["Type"] == "D" ? -parseInt(row["Amount"]) : parseInt(row["Amount"]);
			var dateDetails = getDateDetails(row["Date and Time"]);
			newrow.date = dateDetails.formattedDate;
			newrow.dayName = dateDetails.dayName;
			newrow.day = dateDetails.day;
			newrow.month = dateDetails.month;
			// console.log(dateDetails.month);
			newrow.SrNo = SrNo.toString();
			// addItem(newrow);
			// console.log("SRNO: " + SrNo);
			SrNo = parseInt(SrNo) + 1;
		});
	});
