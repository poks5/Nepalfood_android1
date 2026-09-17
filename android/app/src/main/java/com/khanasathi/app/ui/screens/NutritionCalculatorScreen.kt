package com.khanasathi.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.outlined.Calculate
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.khanasathi.app.ui.theme.*
import com.khanasathi.app.ui.viewmodel.FoodViewModel
import com.khanasathi.app.ui.viewmodel.MealEntry

@Composable
fun NutritionCalculatorScreen(
    viewModel: FoodViewModel,
    onNavigateToFoodList: () -> Unit,
    modifier: Modifier = Modifier
) {
    val mealEntries by viewModel.mealEntries.collectAsState()

    // Aggregate totals based on grams portion
    val totalKcal = mealEntries.sumOf { (it.food.numericEnergy * it.grams) / 100.0 }
    val totalProtein = mealEntries.sumOf { (it.food.numericProtein * it.grams) / 100.0 }
    val totalFat = mealEntries.sumOf { (it.food.numericFat * it.grams) / 100.0 }
    val totalCarbs = mealEntries.sumOf { (it.food.numericCarbs * it.grams) / 100.0 }
    val totalIron = mealEntries.sumOf { (it.food.numericIron * it.grams) / 100.0 }
    val totalCalcium = mealEntries.sumOf { (it.food.numericCalcium * it.grams) / 100.0 }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // Header
        Surface(
            color = MaterialTheme.colorScheme.surface,
            shadowElevation = 1.dp
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Meal Nutrition Calculator",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = "Calculate total macros & minerals for custom portions",
                        fontSize = 12.sp,
                        color = Neutral600
                    )
                }

                if (mealEntries.isNotEmpty()) {
                    TextButton(onClick = { viewModel.clearMeal() }) {
                        Text("Clear All", color = Rose500, fontSize = 12.sp)
                    }
                }
            }
        }

        // Aggregate Totals Dashboard
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            shape = RoundedCornerShape(16.dp),
            color = Emerald800,
            shadowElevation = 3.dp
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Total Meal Nutrients",
                    color = Emerald100,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold
                )

                Spacer(modifier = Modifier.height(4.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Bottom
                ) {
                    Text(
                        text = "${String.format("%.1f", totalKcal)} kcal",
                        color = Color.White,
                        fontSize = 28.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                    Text(
                        text = "${mealEntries.size} items included",
                        color = Emerald100.copy(alpha = 0.8f),
                        fontSize = 12.sp
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    SummaryPill("Protein", "${String.format("%.1f", totalProtein)}g", Emerald100)
                    SummaryPill("Carbs", "${String.format("%.1f", totalCarbs)}g", Emerald100)
                    SummaryPill("Fat", "${String.format("%.1f", totalFat)}g", Emerald100)
                    SummaryPill("Iron", "${String.format("%.1f", totalIron)}mg", Emerald100)
                    SummaryPill("Calcium", "${String.format("%.1f", totalCalcium)}mg", Emerald100)
                }
            }
        }

        // Meal Items List
        if (mealEntries.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Outlined.Calculate,
                        contentDescription = null,
                        tint = Neutral400,
                        modifier = Modifier.size(64.dp)
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    Text(
                        text = "Your meal plan is empty",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Neutral800
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Browse foods and tap 'Add to Meal' or tap the button below to select items.",
                        fontSize = 13.sp,
                        color = Neutral600,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = onNavigateToFoodList,
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Emerald600)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Pick Food to Add")
                    }
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 90.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(mealEntries, key = { it.food.food_id }) { entry ->
                    MealItemCard(
                        entry = entry,
                        onGramsChange = { grams -> viewModel.updateMealGrams(entry.food.food_id, grams) },
                        onRemove = { viewModel.removeMealEntry(entry.food.food_id) }
                    )
                }

                item {
                    OutlinedButton(
                        onClick = onNavigateToFoodList,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, tint = Emerald700)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Add Another Food", color = Emerald700)
                    }
                }
            }
        }
    }
}

@Composable
fun SummaryPill(label: String, value: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(text = label, fontSize = 10.sp, color = color.copy(alpha = 0.8f))
        Text(text = value, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = color)
    }
}

@Composable
fun MealItemCard(
    entry: MealEntry,
    onGramsChange: (Double) -> Unit,
    onRemove: () -> Unit
) {
    val food = entry.food
    val kcal = (food.numericEnergy * entry.grams) / 100.0
    val protein = (food.numericProtein * entry.grams) / 100.0

    Surface(
        shape = RoundedCornerShape(12.dp),
        color = MaterialTheme.colorScheme.surface,
        shadowElevation = 1.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = food.food_name_original,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "${String.format("%.1f", kcal)} kcal • ${String.format("%.1f", protein)}g protein",
                    fontSize = 12.sp,
                    color = Neutral600
                )
            }

            // Portion Adjuster Buttons
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                FilterChip(
                    selected = entry.grams == 50.0,
                    onClick = { onGramsChange(50.0) },
                    label = { Text("50g", fontSize = 10.sp) }
                )
                FilterChip(
                    selected = entry.grams == 100.0,
                    onClick = { onGramsChange(100.0) },
                    label = { Text("100g", fontSize = 10.sp) }
                )
                FilterChip(
                    selected = entry.grams == 200.0,
                    onClick = { onGramsChange(200.0) },
                    label = { Text("200g", fontSize = 10.sp) }
                )
            }

            IconButton(onClick = onRemove, modifier = Modifier.size(32.dp)) {
                Icon(Icons.Default.Delete, contentDescription = "Remove", tint = Rose500, modifier = Modifier.size(18.dp))
            }
        }
    }
}
