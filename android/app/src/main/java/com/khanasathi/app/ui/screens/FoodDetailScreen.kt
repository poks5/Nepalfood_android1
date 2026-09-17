package com.khanasathi.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.outlined.AddCircleOutline
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.Restaurant
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.SubcomposeAsyncImage
import com.khanasathi.app.data.model.FoodItem
import com.khanasathi.app.ui.theme.*
import com.khanasathi.app.ui.viewmodel.FoodViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FoodDetailScreen(
    foodId: String,
    viewModel: FoodViewModel,
    onBack: () -> Unit,
    onNavigateToCalculator: () -> Unit,
    modifier: Modifier = Modifier
) {
    val allFoods by viewModel.allFoods.collectAsState()
    val food = allFoods.find { it.food_id == foodId }

    if (food == null) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = Emerald600)
        }
        return
    }

    var addedToMeal by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = food.food_name_original,
                        maxLines = 1,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = { viewModel.toggleFavorite(food) }) {
                        Icon(
                            imageVector = if (food.is_favorite) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                            contentDescription = "Favorite",
                            tint = if (food.is_favorite) Rose500 else Neutral600
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        }
    ) { innerPadding ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
                .background(MaterialTheme.colorScheme.background)
        ) {
            // Photo Plate Card
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(240.dp)
                    .background(Emerald50),
                contentAlignment = Alignment.Center
            ) {
                val assetPath = "file:///android_asset/images/${food.food_id}.jpg"
                SubcomposeAsyncImage(
                    model = assetPath,
                    contentDescription = food.food_name_original,
                    contentScale = ContentScale.Fit,
                    modifier = Modifier.fillMaxSize(),
                    loading = {
                        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                            CircularProgressIndicator(color = Emerald600)
                        }
                    },
                    error = {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(
                                imageVector = Icons.Outlined.Restaurant,
                                contentDescription = null,
                                tint = Emerald700,
                                modifier = Modifier.size(56.dp)
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text("Official Composition Record", color = Emerald800, fontSize = 13.sp)
                        }
                    }
                )
            }

            // Food Titles & Identifiers
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        color = if (food.source_year == "2024") Emerald100 else Neutral200,
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Text(
                            text = if (food.source_year == "2024") "NARC 2024 Edition" else "DFTQC 2012 Edition",
                            color = if (food.source_year == "2024") Emerald900 else Neutral800,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                        )
                    }

                    Text(
                        text = "ID: ${food.food_id}",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Neutral400
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = food.food_name_original,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = MaterialTheme.colorScheme.onSurface
                )

                if (food.scientific_name.isNotBlank()) {
                    Text(
                        text = food.scientific_name,
                        fontSize = 14.sp,
                        fontStyle = FontStyle.Italic,
                        color = Neutral600
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Group & Subgroup Chips
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    if (food.food_group.isNotBlank()) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = MaterialTheme.colorScheme.surface,
                            shadowElevation = 1.dp
                        ) {
                            Text(
                                text = food.food_group,
                                fontSize = 12.sp,
                                color = Emerald800,
                                fontWeight = FontWeight.Medium,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                            )
                        }
                    }
                    if (food.variety_name.isNotBlank()) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = MaterialTheme.colorScheme.surface,
                            shadowElevation = 1.dp
                        ) {
                            Text(
                                text = "Var: ${food.variety_name}",
                                fontSize = 12.sp,
                                color = Neutral800,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Add to Meal Calculator Button
                Button(
                    onClick = {
                        viewModel.addFoodToMeal(food)
                        addedToMeal = true
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600)
                ) {
                    Icon(Icons.Outlined.AddCircleOutline, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(if (addedToMeal) "Added to Meal (View Calculator)" else "Add to Meal Calculator (100g)")
                }

                if (addedToMeal) {
                    TextButton(
                        onClick = onNavigateToCalculator,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Go to Meal Calculator →", color = Emerald700, fontWeight = FontWeight.Bold)
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Macronutrient Breakdown Header
                Text(
                    text = "Macronutrients (per 100g edible portion)",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )

                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    MacroBox("Energy", food.energy_kcal.ifBlank { "—" }, "kcal", Amber600, Modifier.weight(1f))
                    MacroBox("Protein", food.protein_g.ifBlank { "—" }, "g", Emerald700, Modifier.weight(1f))
                    MacroBox("Fat", food.fat_g.ifBlank { "—" }, "g", Rose500, Modifier.weight(1f))
                    MacroBox("Carbs", food.carbohydrate_g.ifBlank { "—" }, "g", Blue600, Modifier.weight(1f))
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Micronutrient Detailed Grid
                Text(
                    text = "Minerals & Vitamins",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )

                Spacer(modifier = Modifier.height(10.dp))

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(MaterialTheme.colorScheme.surface)
                        .padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    NutrientRow("Calcium (Ca)", food.calcium_mg, "mg")
                    NutrientRow("Iron (Fe)", food.iron_mg, "mg")
                    NutrientRow("Phosphorus (P)", food.phosphorus_mg, "mg")
                    NutrientRow("Potassium (K)", food.potassium_mg, "mg")
                    NutrientRow("Sodium (Na)", food.sodium_mg, "mg")
                    NutrientRow("Zinc (Zn)", food.zinc_mg, "mg")
                    NutrientRow("Vitamin C", food.vitamin_c_mg, "mg")
                    NutrientRow("Total Carotenoids", food.total_carotenoids_ug, "µg")
                    NutrientRow("Crude Fiber", food.crude_fiber_g, "g")
                    NutrientRow("Moisture (Water)", food.water_g, "g")
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Provenance & Scientific Sampling Metadata
                Text(
                    text = "Provenance & Sampling Details",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )

                Spacer(modifier = Modifier.height(10.dp))

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(MaterialTheme.colorScheme.surface)
                        .padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    MetaRow("Province", food.province.ifBlank { "N/A" })
                    MetaRow("District", food.district.ifBlank { "N/A" })
                    MetaRow("Collection Area", food.collection_area.ifBlank { "N/A" })
                    MetaRow("Food State", food.food_state.ifBlank { "Fresh / Raw" })
                    MetaRow("Edible Part", "${food.edible_part} (${food.edible_part_percent}%)")
                    MetaRow("Source Document", food.source_document)
                    MetaRow("Table / Page", "${food.source_table} / Page ${food.source_page}")
                }
            }
        }
    }
}

@Composable
fun MacroBox(label: String, value: String, unit: String, color: Color, modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(10.dp),
        color = MaterialTheme.colorScheme.surface,
        shadowElevation = 1.dp
    ) {
        Column(
            modifier = Modifier.padding(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = label, fontSize = 11.sp, color = Neutral600, fontWeight = FontWeight.Medium)
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = value, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = color)
            Text(text = unit, fontSize = 10.sp, color = Neutral400)
        }
    }
}

@Composable
fun NutrientRow(label: String, value: String, unit: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = label, fontSize = 13.sp, color = Neutral800)
        Text(
            text = if (value.isNotBlank()) "$value $unit" else "Not detected / N/A",
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            color = if (value.isNotBlank()) Emerald800 else Neutral400
        )
    }
}

@Composable
fun MetaRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(text = label, fontSize = 12.sp, color = Neutral400)
        Text(text = value, fontSize = 12.sp, color = Neutral800, fontWeight = FontWeight.Medium)
    }
}
