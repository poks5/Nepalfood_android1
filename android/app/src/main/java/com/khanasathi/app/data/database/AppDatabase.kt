package com.khanasathi.app.data.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.khanasathi.app.data.dao.FoodDao
import com.khanasathi.app.data.model.DatabaseDump
import com.khanasathi.app.data.model.FoodItem
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json

@Database(entities = [FoodItem::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun foodDao(): FoodDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "khana_sathi_db"
                )
                .addCallback(DatabaseCallback(context.applicationContext, scope))
                .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback(
            private val context: Context,
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                // Prepopulate database from assets/database.json
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        populateDatabaseFromAssets(context, database.foodDao())
                    }
                }
            }

            override fun onOpen(db: SupportSQLiteDatabase) {
                super.onOpen(db)
                // Safety check: if database exists but is empty, seed it
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        if (database.foodDao().getCount() == 0) {
                            populateDatabaseFromAssets(context, database.foodDao())
                        }
                    }
                }
            }
        }

        private suspend fun populateDatabaseFromAssets(context: Context, dao: FoodDao) {
            try {
                val jsonString = context.assets.open("database.json").bufferedReader().use { it.readText() }
                val jsonParser = Json { 
                    ignoreUnknownKeys = true 
                    isLenient = true
                    coerceInputValues = true
                }
                val dump = jsonParser.decodeFromString<DatabaseDump>(jsonString)
                
                val photoMap = dump.photos.associateBy { it.food_id }
                val enrichedFoods = dump.master.map { food ->
                    val photo = photoMap[food.food_id]
                    if (photo != null) {
                        food.copy(
                            has_photo = true,
                            photo_filename = photo.image_filename.ifEmpty { "${food.food_id}.jpg" }
                        )
                    } else {
                        food
                    }
                }
                
                dao.insertAll(enrichedFoods)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
