package com.khanasathi.app.data.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.khanasathi.app.data.model.FoodItem
import kotlinx.coroutines.flow.Flow

@Dao
interface FoodDao {
    @Query("SELECT * FROM foods ORDER BY food_name_original ASC")
    fun getAllFoods(): Flow<List<FoodItem>>

    @Query("SELECT * FROM foods WHERE food_id = :id LIMIT 1")
    fun getFoodById(id: String): Flow<FoodItem?>

    @Query("""
        SELECT * FROM foods 
        WHERE (
            food_name_original LIKE '%' || :query || '%' 
            OR scientific_name LIKE '%' || :query || '%' 
            OR variety_name LIKE '%' || :query || '%' 
            OR food_id LIKE '%' || :query || '%'
            OR food_group LIKE '%' || :query || '%'
        )
        AND (:year = 'ALL' OR source_year = :year)
        AND (:group = 'ALL' OR food_group = :group)
        ORDER BY food_name_original ASC
    """)
    fun searchFoods(query: String, year: String = "ALL", group: String = "ALL"): Flow<List<FoodItem>>

    @Query("SELECT * FROM foods WHERE food_group = :group ORDER BY food_name_original ASC")
    fun getFoodsByGroup(group: String): Flow<List<FoodItem>>

    @Query("SELECT * FROM foods WHERE source_year = :year ORDER BY food_name_original ASC")
    fun getFoodsByYear(year: String): Flow<List<FoodItem>>

    @Query("SELECT * FROM foods WHERE is_favorite = 1 ORDER BY food_name_original ASC")
    fun getFavorites(): Flow<List<FoodItem>>

    @Query("UPDATE foods SET is_favorite = :isFavorite WHERE food_id = :foodId")
    suspend fun setFavorite(foodId: String, isFavorite: Boolean)

    @Query("SELECT DISTINCT food_group FROM foods WHERE food_group != '' ORDER BY food_group ASC")
    fun getAllFoodGroups(): Flow<List<String>>

    @Query("SELECT COUNT(*) FROM foods")
    suspend fun getCount(): Int

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(foods: List<FoodItem>)
}
