package com.khanasathi.app.data.model

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
@Entity(
    tableName = "foods",
    indices = [
        Index(value = ["food_id"], unique = true),
        Index(value = ["food_name_original"]),
        Index(value = ["food_group"]),
        Index(value = ["source_year"])
    ]
)
data class FoodItem(
    @PrimaryKey
    @SerialName("food_id")
    val food_id: String,

    @SerialName("food_name_original")
    val food_name_original: String = "",

    @SerialName("scientific_name")
    val scientific_name: String = "",

    @SerialName("food_group")
    val food_group: String = "",

    @SerialName("food_subgroup")
    val food_subgroup: String = "",

    @SerialName("variety_name")
    val variety_name: String = "",

    @SerialName("collection_area")
    val collection_area: String = "",

    @SerialName("district")
    val district: String = "",

    @SerialName("province")
    val province: String = "",

    @SerialName("food_state")
    val food_state: String = "",

    @SerialName("edible_part")
    val edible_part: String = "",

    @SerialName("edible_part_percent")
    val edible_part_percent: String = "",

    @SerialName("energy_kcal")
    val energy_kcal: String = "",

    @SerialName("water_g")
    val water_g: String = "",

    @SerialName("protein_g")
    val protein_g: String = "",

    @SerialName("fat_g")
    val fat_g: String = "",

    @SerialName("ash_g")
    val ash_g: String = "",

    @SerialName("crude_fiber_g")
    val crude_fiber_g: String = "",

    @SerialName("carbohydrate_g")
    val carbohydrate_g: String = "",

    @SerialName("calcium_mg")
    val calcium_mg: String = "",

    @SerialName("iron_mg")
    val iron_mg: String = "",

    @SerialName("phosphorus_mg")
    val phosphorus_mg: String = "",

    @SerialName("potassium_mg")
    val potassium_mg: String = "",

    @SerialName("sodium_mg")
    val sodium_mg: String = "",

    @SerialName("zinc_mg")
    val zinc_mg: String = "",

    @SerialName("total_carotenoids_ug")
    val total_carotenoids_ug: String = "",

    @SerialName("vitamin_c_mg")
    val vitamin_c_mg: String = "",

    @SerialName("nutrient_basis")
    val nutrient_basis: String = "100g edible portion",

    @SerialName("source_document")
    val source_document: String = "",

    @SerialName("source_year")
    val source_year: String = "2024",

    @SerialName("source_page")
    val source_page: String = "",

    @SerialName("source_table")
    val source_table: String = "",

    @SerialName("notes")
    val notes: String = "",

    val has_photo: Boolean = false,
    val photo_filename: String = "",
    val is_favorite: Boolean = false
) {
    val numericEnergy: Double
        get() = energy_kcal.toDoubleOrNull() ?: 0.0

    val numericProtein: Double
        get() = protein_g.toDoubleOrNull() ?: 0.0

    val numericCarbs: Double
        get() = carbohydrate_g.toDoubleOrNull() ?: 0.0

    val numericFat: Double
        get() = fat_g.toDoubleOrNull() ?: 0.0

    val numericFiber: Double
        get() = crude_fiber_g.toDoubleOrNull() ?: 0.0

    val numericIron: Double
        get() = iron_mg.toDoubleOrNull() ?: 0.0

    val numericCalcium: Double
        get() = calcium_mg.toDoubleOrNull() ?: 0.0

    val numericVitaminC: Double
        get() = vitamin_c_mg.toDoubleOrNull() ?: 0.0
}

@Serializable
data class FoodPhotoMapping(
    @SerialName("food_id")
    val food_id: String,

    @SerialName("figure_number")
    val figure_number: String = "",

    @SerialName("figure_caption")
    val figure_caption: String = "",

    @SerialName("image_filename")
    val image_filename: String = ""
)

@Serializable
data class DatabaseDump(
    val master: List<FoodItem>,
    val photos: List<FoodPhotoMapping> = emptyList()
)
