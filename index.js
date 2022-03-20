const request = require("request");
const cheerio = require("cheerio");
const xlsx = require("xlsx");
const url = "https://www.worldometers.info/coronavirus/";

request(url, cb);

function cb(error, response, html) {
  if (error) {
    console.error("error:", error); // Print the error if one occurred
  } else {
    handlehtml(html);
    // Print the HTML for the Google homepage.
  }
}
function handlehtml(html) {
  let $ = cheerio.load(html);
  const ScrapedJSON = [];
  const Headers = [
    "Country,Other",
    "Total Cases",
    "New Cases",
    "Total Deaths",
    "New Deaths",
    "Total Recovered",
    "Acive Cases",
    "Serious, Critical",
    "Total Cases/1M Populatio n",
    "Deaths/ 1M Population",
    "Total Tests",
    "Tests/1M Population",
    "Population",
  ];
  //Go to each tr and push each td of each tr into ScrapedJSON.
  $("tbody > tr").each((index, element) => {
    const tds = $(element).find("td");
    const tableRow = {};
    $(tds).each((i, element) => {
      tableRow[Headers[i]] = $(element).text().trim().replace("\n", "");
    });
    ScrapedJSON.push(tableRow);
  });
  // Scraped data is the data which is json file
  let newWB = xlsx.utils.book_new();
  let newWS = xlsx.utils.json_to_sheet(ScrapedJSON);
  xlsx.utils.book_append_sheet(newWB, newWS);
  xlsx.writeFile(newWB, "./Scraped Data.xlsx");
  console.log("Data is scraped !!");
}
