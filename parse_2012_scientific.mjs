import xlsx from 'xlsx';
import fs from 'fs';

const workbook = xlsx.readFile('public/Nepal_Food_composition_Database_2012.xlsx');
const sheet_name_list = workbook.SheetNames;
if (sheet_name_list.length > 1) {
    console.log("Parsing Sheet 2 for scientific names...");
    const xlData2 = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
    
    // We need to map scientific names back to the records based on SN or English Name
    const db = JSON.parse(fs.readFileSync('src/data/database.json', 'utf-8'));
    
    let matched = 0;
    
    // Create lookup from Sheet 2
    // Keys in Sheet 2 usually: "S. N.", "Food Commodity (English)", "Food Commodity (Local)", "Scientific Name"
    // Let's print keys first to be sure
    if (xlData2.length > 0) {
        console.log("Sheet 2 keys:", Object.keys(xlData2[0]));
        
        // Let's try matching by index or name
        for (const row of xlData2) {
            const sn = row['S. N.'] || row['S.N.'] || row['SN'];
            const sciName = row['Scientific Name'];
            const localName = row['Food Commodity (Local)'] || '';
            
            if (sn !== undefined && sciName) {
                // Find matching 2012 record
                const dbIndex = db.master.findIndex(item => item.source_year === "2012" && String(item.food_id).endsWith(String(sn).padStart(4, '0')));
                
                if (dbIndex !== -1) {
                    db.master[dbIndex].scientific_name = sciName.trim();
                    if (localName && !db.master[dbIndex].variety_name) {
                        db.master[dbIndex].variety_name = localName.trim();
                    }
                    matched++;
                } else {
                    // Try matching by name
                    const name = row['Food Commodity (English)'];
                    if (name) {
                        const dbIndexName = db.master.findIndex(item => item.source_year === "2012" && item.food_name_original.toLowerCase() === String(name).trim().toLowerCase());
                        if (dbIndexName !== -1) {
                            db.master[dbIndexName].scientific_name = sciName.trim();
                            if (localName && !db.master[dbIndexName].variety_name) {
                                db.master[dbIndexName].variety_name = localName.trim();
                            }
                            matched++;
                        }
                    }
                }
            }
        }
        
        fs.writeFileSync('src/data/database.json', JSON.stringify(db, null, 2));
        console.log(`Matched ${matched} scientific names from Sheet 2.`);
    }
}
