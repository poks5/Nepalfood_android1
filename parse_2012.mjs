import xlsx from 'xlsx';
import fs from 'fs';

const workbook = xlsx.readFile('public/Nepal_Food_composition_Database_2012.xlsx');
const sheet_name_list = workbook.SheetNames;
console.log("Sheets:", sheet_name_list);
const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

console.log("Rows:", xlData.length);
if (xlData.length > 0) {
    console.log("Keys of first row:", Object.keys(xlData[0]));
    console.log("First row data:", xlData[0]);
}

fs.writeFileSync('public/2012_data_dump.json', JSON.stringify(xlData, null, 2));
