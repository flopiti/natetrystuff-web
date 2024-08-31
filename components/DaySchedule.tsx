import { formatDate } from "@/app/utils";

const DaySchedule = ({ day, index, meals, mealsSchedule, addMealsIndexes, showAddMeal, addMealToSchedule, deleteScheduledMeal }: any) => {

    return <div
    key={index}
    className="md:w-1/4 w-full flex flex-col bg-[#3B465C] shadow-lg rounded-lg p-3 md:p-0 items-center"
  >
    <h1 className="text-xl font-extrabold mb-2 text-gray-800 m-4">
      {formatDate(day)}
    </h1>
    <div className="flex flex-col items-center flex-grow rounded-lg w-full">
      {mealsSchedule.filter((mealSched: any) => {
        const mealDate = new Date(mealSched.scheduledTime);
        return (
          mealDate.toLocaleDateString() === day.toLocaleDateString()
        );
      }).length > 0 ? (
        <ul className="m-2 rounded-lg">
          {mealsSchedule
            .filter((mealSched: any) => {
              const mealDate = new Date(mealSched.scheduledTime);
              return (
                mealDate.toLocaleDateString() ===
                day.toLocaleDateString()
              );
            })
            .map((mealSched: any, idx: any) => (
              <li
                key={idx}
                className="flex justify-between items-center text-gray-500"
              >
                <span className="font-medium">
                  {mealSched.meal.mealName}
                </span>
                <button
                  className="bg-red-800 opacity-50 text-white rounded px-2 py-1 m-2"
                  onClick={() =>
                    deleteScheduledMeal(mealSched.scheduleId)
                  }
                >
                  X
                </button>
              </li>
            ))}
        </ul>
      ) : (
        <p className="text-gray-500 m-2">No meals scheduled</p>
      )}
      <button
        className="text-white mt-2 py-1 px-4 rounded hover:bg-blue-600"
        onClick={() => showAddMeal(index)}
      >
        Add Meal to Schedule
      </button>
      {addMealsIndexes.includes(index) && (
        <ul className="mt-2">
          {meals.map((meal: any, idx: any) => (
            <li
              className="m-2 text-sm bg-yellow-500 p-2 rounded hover:bg-yellow-600 cursor-pointer text-black"
              key={idx}
              onClick={() => addMealToSchedule(meal, day)}
            >
              {meal.mealName}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
}

export default DaySchedule;