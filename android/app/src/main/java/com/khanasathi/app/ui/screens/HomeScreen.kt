package com.khanasathi.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.khanasathi.app.data.model.FoodItem
import com.khanasathi.app.ui.components.FoodCard
import com.khanasathi.app.ui.theme.*
import com.khanasathi.app.ui.viewmodel.FoodViewModel

@Composable
fun HomeScreen(
    viewModel: FoodViewModel,
    onNavigateToFoods: (category: String) -> Unit,
    onNavigateToFoodDetail: (foodId: String) -> Unit,
    onNavigateToSearch: () -> Unit,
    modifier: Modifier = Modifier
) {
    val allFoods by viewModel.allFoods.collectAsState()
    val categories by viewModel.foodGroups.collectAsState()

    val count2024 = allFoods.count { it.source_year == "2024" }
    val count2012 = allFoods.count { it.source_year == "2012" }
    val featuredFoods = allFoods.filter { it.has_photo }.take(6)

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(bottom = 90.dp)
    ) {
        // Hero Header
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(
                            listOf(Emerald800, Emerald700)
                        )
                    )
                    .padding(horizontal = 20.dp, vertical = 24.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "खाना साथी (Khana Sathi)",
                                color = Emerald50,
                                fontWeight = FontWeight.Bold,
                                fontSize = 22.sp
                            )
                            Text(
                                text = "Nepal Food & Nutrition Database",
                                color = Emerald100.copy(alpha = 0.85f),
                                fontSize = 13.sp
                            )
                        }

                        Surface(
                            color = Emerald900.copy(alpha = 0.6f),
                            shape = RoundedCornerShape(20.dp)
                        ) {
                            Text(
                                text = "100% Offline",
                                color = Emerald100,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(18.dp))

                    // Search Prompt Bar
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable(onClick = onNavigateToSearch),
                        shape = RoundedCornerShape(14.dp),
                        color = Color.White,
                        shadowElevation = 4.dp
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 14.dp, vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Search,
                                contentDescription = "Search",
                                tint = Neutral400
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = "Search 644 foods (e.g. Gundruk, Champa, Rice)...",
                                color = Neutral400,
                                fontSize = 14.sp
                            )
                        }
                    }
                }
            }
        }

        // Database Summary Stats
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 14.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                StatCard(
                    title = "Total Foods",
                    value = "${allFoods.size}",
                    subtitle = "Verified entries",
                    icon = Icons.Outlined.MenuBook,
                    color = Emerald700,
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    title = "NARC 2024",
                    value = "$count2024",
                    subtitle = "Latest edition",
                    icon = Icons.Outlined.Verified,
                    color = Blue600,
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    title = "DFTQC 2012",
                    value = "$count2012",
                    subtitle = "Historical basis",
                    icon = Icons.Outlined.History,
                    color = Amber600,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Categories Carousel
        item {
            Column(modifier = Modifier.fillMaxWidth().padding(top = 8.dp)) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Food Groups",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    TextButton(onClick = { onNavigateToFoods("ALL") }) {
                        Text("View All", color = Emerald700, fontWeight = FontWeight.SemiBold)
                    }
                }

                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.padding(top = 4.dp, bottom = 12.dp)
                ) {
                    items(categories.take(8)) { cat ->
                        Surface(
                            modifier = Modifier.clickable { onNavigateToFoods(cat) },
                            shape = RoundedCornerShape(12.dp),
                            color = MaterialTheme.colorScheme.surface,
                            shadowElevation = 1.dp
                        ) {
                            Column(
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text(
                                    text = cat,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                            }
                        }
                    }
                }
            }
        }

        // Photographic Highlights Section
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Photographic Specimens",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = "Sampled across Nepal's 7 Provinces",
                        fontSize = 12.sp,
                        color = Neutral600
                    )
                }
            }
        }

        items(featuredFoods) { food ->
            FoodCard(
                food = food,
                onClick = { onNavigateToFoodDetail(food.food_id) },
                onToggleFavorite = { viewModel.toggleFavorite(food) },
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
            )
        }
    }
}

@Composable
fun StatCard(
    title: String,
    value: String,
    subtitle: String,
    icon: ImageVector,
    color: Color,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        color = MaterialTheme.colorScheme.surface,
        shadowElevation = 1.dp
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = color,
                modifier = Modifier.size(20.dp)
            )
            Text(
                text = value,
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = title,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                color = Neutral800
            )
            Text(
                text = subtitle,
                fontSize = 10.sp,
                color = Neutral400
            )
        }
    }
}
