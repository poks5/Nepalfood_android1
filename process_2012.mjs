import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('public/2012_data_dump.json', 'utf-8'));
const existingDb = JSON.parse(fs.readFileSync('src/data/database.json', 'utf-8'));

let idCounter = 101; // Start after 2024 data (NFD-00100)

let currentCategory = "";

const mapped2012 = [];

for (const row of rawData) {
    if (row['Category']) {
        currentCategory = row['Category'].replace(/^[A-Z]\.\s*/, '').trim();
    }
    
    if (!row['Food Commodity']) continue; // Skip empty rows
    
    // Some rows might be headers or empty
    if (String(row['Food Commodity']).trim() === '' || String(row['Food Commodity']).toLowerCase().includes('food commodity')) {
        continue;
    }
    
    // Generate an ID
    const foodId = `NFD-2012-${String(idCounter).padStart(4, '0')}`;
    idCounter++;
    
    const item = {
        food_id: foodId,
        food_name_original: String(row['Food Commodity']).trim(),
        scientific_name: "", // Not explicitly in 2012
        food_group: currentCategory,
        food_subgroup: "",
        variety_name: "",
        collection_area: "",
        district: "",
        province: "",
        food_state: "Raw",
        edible_part: "",
        edible_part_percent: String(row['Edible Portion'] ?? ""),
        inedible_part_percent: "",
        lb_ratio: "",
        kernel_weight_1000_g: "",
        energy_kcal: String(row['Energy (KCal)'] ?? ""),
        water_g: String(row['Moisture (g)'] ?? ""),
        protein_g: String(row['Protein (g)'] ?? ""),
        fat_g: String(row['Fat (g)'] ?? ""),
        ash_g: String(row['Minerals (g)'] ?? ""), // Mapped Minerals to Ash for consistency? 
        crude_fiber_g: String(row['Fiber (g)'] ?? ""),
        carbohydrate_g: String(row['Carbohydrate (g)'] ?? ""),
        reducing_sugar_g: "",
        calcium_mg: String(row['Calcium (mg)'] ?? ""),
        iron_mg: String(row['Iron (mg)'] ?? ""),
        phosphorus_mg: String(row['Phosphorous (mg)'] ?? ""),
        potassium_mg: "",
        sodium_mg: "",
        zinc_mg: "",
        total_carotenoids_ug: "",
        vitamin_c_mg: "",
        nutrient_basis: "100g",
        source_document: "Nepal Food Composition Table",
        source_year: "2012",
        source_page: "",
        source_table: "",
        source_figure: "",
        extraction_confidence: "HIGH",
        needs_manual_review: "FALSE",
        notes: ""
    };
    
    mapped2012.push(item);
}

// Merge and save
existingDb.master = [...existingDb.master, ...mapped2012];
fs.writeFileSync('src/data/database.json', JSON.stringify(existingDb, null, 2));

console.log(`Added ${mapped2012.length} records from 2012 dataset.`);
