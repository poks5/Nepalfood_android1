package com.khanasathi.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.Restaurant
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.SubcomposeAsyncImage
import com.khanasathi.app.data.model.FoodItem
import com.khanasathi.app.ui.theme.*

@Composable
fun FoodCard(
    food: FoodItem,
    onClick: () -> Unit,
    onToggleFavorite: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Food Image / Icon
            Box(
                modifier = Modifier
                    .size(76.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Emerald50),
                contentAlignment = Alignment.Center
            ) {
                val assetPath = "file:///android_asset/images/${food.food_id}.jpg"
                SubcomposeAsyncImage(
                    model = assetPath,
                    contentDescription = food.food_name_original,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize(),
                    loading = {
                        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                            CircularProgressIndicator(modifier = Modifier.size(24.dp), strokeWidth = 2.dp)
                        }
                    },
                    error = {
                        Icon(
                            imageVector = Icons.Outlined.Restaurant,
                            contentDescription = null,
                            tint = Emerald600,
                            modifier = Modifier.size(32.dp)
                        )
                    }
                )
            }

            Spacer(modifier = Modifier.width(12.dp))

            // Food Info
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Edition badge
                    Surface(
                        color = if (food.source_year == "2024") Emerald100 else Neutral200,
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Text(
                            text = if (food.source_year == "2024") "2024 NARC" else "2012 DFTQC",
                            color = if (food.source_year == "2024") Emerald800 else Neutral800,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.SemiBold,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(6.dp))

                    Text(
                        text = food.food_id,
                        fontSize = 11.sp,
                        color = Neutral400,
                        fontWeight = FontWeight.Medium
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = food.food_name_original,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = MaterialTheme.colorScheme.onSurface,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                if (food.scientific_name.isNotBlank()) {
                    Text(
                        text = food.scientific_name,
                        fontStyle = FontStyle.Italic,
                        fontSize = 12.sp,
                        color = Neutral600,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))

                // Nutrient Highlights
                Row(
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    NutrientMiniBadge(
                        label = "Energy",
                        value = if (food.energy_kcal.isNotBlank()) "${food.energy_kcal} kcal" else "—",
                        color = Amber600
                    )
                    NutrientMiniBadge(
                        label = "Protein",
                        value = if (food.protein_g.isNotBlank()) "${food.protein_g}g" else "—",
                        color = Emerald700
                    )
                    NutrientMiniBadge(
                        label = "Carbs",
                        value = if (food.carbohydrate_g.isNotBlank()) "${food.carbohydrate_g}g" else "—",
                        color = Blue600
                    )
                }
            }

            // Favorite Button
            IconButton(
                onClick = onToggleFavorite,
                modifier = Modifier.size(36.dp)
            ) {
                Icon(
                    imageVector = if (food.is_favorite) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                    contentDescription = "Favorite",
                    tint = if (food.is_favorite) Rose500 else Neutral400,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}

@Composable
fun NutrientMiniBadge(
    label: String,
    value: String,
    color: Color
) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(6.dp)
                .clip(CircleShape)
                .background(color)
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = value,
            fontSize = 11.sp,
            fontWeight = FontWeight.Medium,
            color = Neutral800
        )
    }
}
