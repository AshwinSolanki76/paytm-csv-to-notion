export function getDateDetails(DateString) {
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
export function processRow(row, SrNo) {
	var newrow = {};
	newrow.amount =
		row["Type"] == "D" ? -parseInt(row["Amount"]) : parseInt(row["Amount"]);
	var dateDetails = getDateDetails(row["Date and Time"]);
	newrow.date = dateDetails.formattedDate;
	newrow.dayName = dateDetails.dayName;
	newrow.day = dateDetails.day;
	newrow.month = dateDetails.month;
	newrow.SrNo = SrNo.toString();
	return newrow;
}
