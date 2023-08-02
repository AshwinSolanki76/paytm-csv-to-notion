import { Client } from "@notionhq/client";
import pkg from "dotenv";
import fs from "fs";

const { dotenv } = pkg;
pkg.config();

const notion = new Client({
	auth: process.env.NOTION_TOKEN,
	timeout: 120000,
});
export const databaseId = process.env.DB_ID;

export async function addItem(row) {
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

export async function saveDatatoFile() {
	const res = await notion.databases.query({
		database_id: databaseId,
	});
	fs.writeFileSync(
		"./Data.json",
		JSON.stringify(res.results, null, 2),
		"utf-8"
	);
}

export async function getSrNoToStartFrom() {
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
		return highestSrNoPage.properties.Number.formula.number + 1;
	} catch (error) {
		console.error("Error fetching pages:", error);
		return null;
	}
}
export default notion;
