package com.khanasathi.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Sort
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.khanasathi.app.ui.components.FoodCard
import com.khanasathi.app.ui.theme.*
import com.khanasathi.app.ui.viewmodel.FoodViewModel
import com.khanasathi.app.ui.viewmodel.SortOption

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FoodListScreen(
    viewModel: FoodViewModel,
    onNavigateToFoodDetail: (foodId: String) -> Unit,
    modifier: Modifier = Modifier
) {
    val foods by viewModel.filteredFoods.collectAsState()
    val categories by viewModel.foodGroups.collectAsState()
    val currentQuery by viewModel.searchQuery.collectAsState()
    val currentYear by viewModel.filterYear.collectAsState()
    val currentCategory by viewModel.filterCategory.collectAsState()
    val currentSort by viewModel.sortOption.collectAsState()

    var showSortMenu by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // Search & Filter Header
        Surface(
            color = MaterialTheme.colorScheme.surface,
            shadowElevation = 2.dp
        ) {
            Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)) {
                // Search Input Field
                OutlinedTextField(
                    value = currentQuery,
                    onValueChange = { viewModel.searchQuery.value = it },
                    placeholder = { Text("Search food, scientific name, district...") },
                    leadingIcon = {
                        Icon(Icons.Default.Search, contentDescription = "Search", tint = Neutral400)
                    },
                    trailingIcon = {
                        if (currentQuery.isNotEmpty()) {
                            IconButton(onClick = { viewModel.searchQuery.value = "" }) {
                                Icon(Icons.Default.Close, contentDescription = "Clear", tint = Neutral400)
                            }
                        }
                    },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Emerald600,
                        unfocusedBorderColor = Neutral200
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Edition Filter Chips (ALL, 2024 NARC, 2012 DFTQC)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    FilterChip(
                        selected = currentYear == "ALL",
                        onClick = { viewModel.filterYear.value = "ALL" },
                        label = { Text("All (644)", fontSize = 12.sp) }
                    )
                    FilterChip(
                        selected = currentYear == "2024",
                        onClick = { viewModel.filterYear.value = "2024" },
                        label = { Text("2024 NARC (134)", fontSize = 12.sp) }
                    )
                    FilterChip(
                        selected = currentYear == "2012",
                        onClick = { viewModel.filterYear.value = "2012" },
                        label = { Text("2012 DFTQC (510)", fontSize = 12.sp) }
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))

                // Category Filter Horizontal Row
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    item {
                        SuggestionChip(
                            onClick = { viewModel.filterCategory.value = "ALL" },
                            label = { Text("All Categories") },
                            colors = SuggestionChipDefaults.suggestionChipColors(
                                containerColor = if (currentCategory == "ALL") Emerald100 else MaterialTheme.colorScheme.surface
                            )
                        )
                    }
                    items(categories) { cat ->
                        SuggestionChip(
                            onClick = { viewModel.filterCategory.value = cat },
                            label = { Text(cat) },
                            colors = SuggestionChipDefaults.suggestionChipColors(
                                containerColor = if (currentCategory == cat) Emerald100 else MaterialTheme.colorScheme.surface
                            )
                        )
                    }
                }
            }
        }

        // Subheader with Count and Sort Trigger
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "${foods.size} foods found",
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = Neutral600
            )

            Box {
                TextButton(
                    onClick = { showSortMenu = true },
                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Icon(Icons.Default.Sort, contentDescription = null, modifier = Modifier.size(16.dp), tint = Emerald700)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = when (currentSort) {
                            SortOption.NAME_ASC -> "Name A-Z"
                            SortOption.ENERGY_DESC -> "Highest Energy"
                            SortOption.PROTEIN_DESC -> "Highest Protein"
                            SortOption.IRON_DESC -> "Highest Iron"
                            SortOption.CALCIUM_DESC -> "Highest Calcium"
                        },
                        fontSize = 12.sp,
                        color = Emerald700,
                        fontWeight = FontWeight.Medium
                    )
                }

                DropdownMenu(
                    expanded = showSortMenu,
                    onDismissRequest = { showSortMenu = false }
                ) {
                    DropdownMenuItem(
                        text = { Text("Name (A to Z)") },
                        onClick = { viewModel.sortOption.value = SortOption.NAME_ASC; showSortMenu = false }
                    )
                    DropdownMenuItem(
                        text = { Text("Highest Energy (kcal)") },
                        onClick = { viewModel.sortOption.value = SortOption.ENERGY_DESC; showSortMenu = false }
                    )
                    DropdownMenuItem(
                        text = { Text("Highest Protein (g)") },
                        onClick = { viewModel.sortOption.value = SortOption.PROTEIN_DESC; showSortMenu = false }
                    )
                    DropdownMenuItem(
                        text = { Text("Highest Iron (mg)") },
                        onClick = { viewModel.sortOption.value = SortOption.IRON_DESC; showSortMenu = false }
                    )
                    DropdownMenuItem(
                        text = { Text("Highest Calcium (mg)") },
                        onClick = { viewModel.sortOption.value = SortOption.CALCIUM_DESC; showSortMenu = false }
                    )
                }
            }
        }

        // List of Foods
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 90.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(foods, key = { it.food_id }) { food ->
                FoodCard(
                    food = food,
                    onClick = { onNavigateToFoodDetail(food.food_id) },
                    onToggleFavorite = { viewModel.toggleFavorite(food) }
                )
            }
        }
    }
}
