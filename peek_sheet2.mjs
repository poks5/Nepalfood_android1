import xlsx from 'xlsx';
const workbook = xlsx.readFile('public/Nepal_Food_composition_Database_2012.xlsx');
const sheet_name_list = workbook.SheetNames;
const xlData2 = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]], {header: 1});
console.log(xlData2.slice(0, 10));
