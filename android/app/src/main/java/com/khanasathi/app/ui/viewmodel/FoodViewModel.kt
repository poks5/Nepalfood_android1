package com.khanasathi.app.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.khanasathi.app.data.database.AppDatabase
import com.khanasathi.app.data.model.FoodItem
import com.khanasathi.app.data.repository.FoodRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class SortOption {
    NAME_ASC,
    ENERGY_DESC,
    PROTEIN_DESC,
    IRON_DESC,
    CALCIUM_DESC
}

data class MealEntry(
    val food: FoodItem,
    val grams: Double = 100.0
)

class FoodViewModel(application: Application) : AndroidViewModel(application) {
    private val repository: FoodRepository

    val searchQuery = MutableStateFlow("")
    val filterYear = MutableStateFlow("ALL") // "ALL", "2024", "2012"
    val filterCategory = MutableStateFlow("ALL")
    val sortOption = MutableStateFlow(SortOption.NAME_ASC)

    val favorites: StateFlow<List<FoodItem>>
    val foodGroups: StateFlow<List<String>>
    val allFoods: StateFlow<List<FoodItem>>

    val mealEntries = MutableStateFlow<List<MealEntry>>(emptyList())

    init {
        val db = AppDatabase.getDatabase(application, viewModelScope)
        repository = FoodRepository(db.foodDao())
        favorites = repository.favorites.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
        foodGroups = repository.foodGroups.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
        allFoods = repository.allFoods.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    }

    val filteredFoods: StateFlow<List<FoodItem>> = combine(
        allFoods,
        searchQuery,
        filterYear,
        filterCategory,
        sortOption
    ) { foods, query, year, cat, sort ->
        var list = foods

        if (year != "ALL") {
            list = list.filter { it.source_year == year }
        }

        if (cat != "ALL") {
            list = list.filter { it.food_group.equals(cat, ignoreCase = true) }
        }

        if (query.isNotBlank()) {
            val q = query.trim().lowercase()
            list = list.filter {
                it.food_name_original.lowercase().contains(q) ||
                it.scientific_name.lowercase().contains(q) ||
                it.variety_name.lowercase().contains(q) ||
                it.food_id.lowercase().contains(q) ||
                it.food_group.lowercase().contains(q)
            }
        }

        when (sort) {
            SortOption.NAME_ASC -> list.sortedBy { it.food_name_original }
            SortOption.ENERGY_DESC -> list.sortedByDescending { it.numericEnergy }
            SortOption.PROTEIN_DESC -> list.sortedByDescending { it.numericProtein }
            SortOption.IRON_DESC -> list.sortedByDescending { it.numericIron }
            SortOption.CALCIUM_DESC -> list.sortedByDescending { it.numericCalcium }
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun toggleFavorite(food: FoodItem) {
        viewModelScope.launch {
            repository.setFavorite(food.food_id, !food.is_favorite)
        }
    }

    fun addFoodToMeal(food: FoodItem, grams: Double = 100.0) {
        val current = mealEntries.value.toMutableList()
        val existingIndex = current.indexOfFirst { it.food.food_id == food.food_id }
        if (existingIndex >= 0) {
            val existing = current[existingIndex]
            current[existingIndex] = existing.copy(grams = existing.grams + grams)
        } else {
            current.add(MealEntry(food, grams))
        }
        mealEntries.value = current
    }

    fun removeMealEntry(foodId: String) {
        mealEntries.value = mealEntries.value.filter { it.food.food_id != foodId }
    }

    fun updateMealGrams(foodId: String, grams: Double) {
        mealEntries.value = mealEntries.value.map {
            if (it.food.food_id == foodId) it.copy(grams = grams) else it
        }
    }

    fun clearMeal() {
        mealEntries.value = emptyList()
    }
}
