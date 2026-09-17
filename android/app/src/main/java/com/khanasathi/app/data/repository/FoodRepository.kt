package com.khanasathi.app.data.repository

import com.khanasathi.app.data.dao.FoodDao
import com.khanasathi.app.data.model.FoodItem
import kotlinx.coroutines.flow.Flow

class FoodRepository(private val foodDao: FoodDao) {
    val allFoods: Flow<List<FoodItem>> = foodDao.getAllFoods()
    val favorites: Flow<List<FoodItem>> = foodDao.getFavorites()
    val foodGroups: Flow<List<String>> = foodDao.getAllFoodGroups()

    fun searchFoods(query: String, year: String = "ALL", group: String = "ALL"): Flow<List<FoodItem>> {
        return foodDao.searchFoods(query, year, group)
    }

    fun getFoodById(id: String): Flow<FoodItem?> {
        return foodDao.getFoodById(id)
    }

    suspend fun setFavorite(foodId: String, isFavorite: Boolean) {
        foodDao.setFavorite(foodId, isFavorite)
    }
}
