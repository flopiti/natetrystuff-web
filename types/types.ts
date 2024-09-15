export interface Meal {
    mealName: string;
    // Add other necessary properties
}

export interface Grocery {
    quantity: number;
    unit: string;
    ingredient: {
        ingredientName: string;
    };
}

export interface MealSchedule {
    scheduleId: string;
    meal: Meal;
    scheduledTime: string; // assuming ISO date format
}
