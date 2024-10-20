package com.natetrystuff.Meal;

import java.util.List;

import lombok.Data;
@Data
public class MealDTO {
    private Long mealId;
    private String mealName;
    private String imageUrl; // new field for image URL
    private List<MealIngredientDTO> mealIngredients;

    @Data
    public static class MealIngredientDTO {
        private Long mealIngredientId;
        private String ingredientName;
        private double quantity;
        private String unit;
    }
}
