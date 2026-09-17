package com.khanasathi.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.khanasathi.app.ui.screens.*
import com.khanasathi.app.ui.theme.Emerald700
import com.khanasathi.app.ui.theme.KhanaSathiTheme
import com.khanasathi.app.ui.viewmodel.FoodViewModel

enum class ScreenTab(
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
) {
    HOME("Home", Icons.Filled.Home, Icons.Outlined.Home),
    FOODS("Foods", Icons.Filled.Restaurant, Icons.Outlined.Restaurant),
    FAVORITES("Favorites", Icons.Filled.Favorite, Icons.Outlined.FavoriteBorder),
    CALCULATOR("Calculator", Icons.Filled.Calculate, Icons.Outlined.Calculate),
    MORE("More", Icons.Filled.Info, Icons.Outlined.Info)
}

class MainActivity : ComponentActivity() {
    private val viewModel: FoodViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            KhanaSathiTheme {
                var currentTab by remember { mutableStateOf(ScreenTab.HOME) }
                var selectedFoodId by remember { mutableStateOf<String?>(null) }

                val favorites by viewModel.favorites.collectAsState()

                // Intercept back button when in detail view
                BackHandler(enabled = selectedFoodId != null) {
                    selectedFoodId = null
                }

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        if (selectedFoodId == null) {
                            NavigationBar(
                                containerColor = MaterialTheme.colorScheme.surface,
                                tonalElevation = 3.dp
                            ) {
                                ScreenTab.values().forEach { tab ->
                                    val isSelected = currentTab == tab
                                    NavigationBarItem(
                                        selected = isSelected,
                                        onClick = { currentTab = tab },
                                        icon = {
                                            BadgedBox(
                                                badge = {
                                                    if (tab == ScreenTab.FAVORITES && favorites.isNotEmpty()) {
                                                        Badge { Text("${favorites.size}") }
                                                    }
                                                }
                                            ) {
                                                Icon(
                                                    imageVector = if (isSelected) tab.selectedIcon else tab.unselectedIcon,
                                                    contentDescription = tab.title
                                                )
                                            }
                                        },
                                        label = {
                                            Text(
                                                text = tab.title,
                                                fontSize = 11.sp
                                            )
                                        },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = Emerald700,
                                            selectedTextColor = Emerald700,
                                            indicatorColor = MaterialTheme.colorScheme.primaryContainer
                                        )
                                    )
                                }
                            }
                        }
                    }
                ) { innerPadding ->
                    val screenModifier = Modifier.padding(innerPadding)

                    if (selectedFoodId != null) {
                        FoodDetailScreen(
                            foodId = selectedFoodId!!,
                            viewModel = viewModel,
                            onBack = { selectedFoodId = null },
                            onNavigateToCalculator = {
                                selectedFoodId = null
                                currentTab = ScreenTab.CALCULATOR
                            }
                        )
                    } else {
                        when (currentTab) {
                            ScreenTab.HOME -> {
                                HomeScreen(
                                    viewModel = viewModel,
                                    onNavigateToFoods = { category ->
                                        viewModel.filterCategory.value = category
                                        currentTab = ScreenTab.FOODS
                                    },
                                    onNavigateToFoodDetail = { id -> selectedFoodId = id },
                                    onNavigateToSearch = { currentTab = ScreenTab.FOODS },
                                    modifier = screenModifier
                                )
                            }
                            ScreenTab.FOODS -> {
                                FoodListScreen(
                                    viewModel = viewModel,
                                    onNavigateToFoodDetail = { id -> selectedFoodId = id },
                                    modifier = screenModifier
                                )
                            }
                            ScreenTab.FAVORITES -> {
                                FavoritesScreen(
                                    viewModel = viewModel,
                                    onNavigateToFoodDetail = { id -> selectedFoodId = id },
                                    modifier = screenModifier
                                )
                            }
                            ScreenTab.CALCULATOR -> {
                                NutritionCalculatorScreen(
                                    viewModel = viewModel,
                                    onNavigateToFoodList = { currentTab = ScreenTab.FOODS },
                                    modifier = screenModifier
                                )
                            }
                            ScreenTab.MORE -> {
                                MoreScreen(
                                    modifier = screenModifier
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
