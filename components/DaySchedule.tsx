import { fetchAPI, formatDate } from "@/app/utils";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const DaySchedule = ({
    day,
    meals,
    mealsSchedule,
    addMealToSchedule,
    deleteScheduledMeal,
    day_,
    setDays,
    days,
    setMealsSchedule,
}: any) => {
    const setDayInOffice = async () => {
        const formattedDate = day.toISOString().slice(0, 10);
        if (day_) {
            day_.inOffice = true;
            const response = await fetchAPI(`/api/days/${day_.id}`, "PUT", day_);
            if (response) {
                setDays([
                    ...days.filter((day: any) => day.date !== formattedDate),
                    response.data,
                ]);
            }
        } else {
            const inOfficePayload = { date: formattedDate, inOffice: true };
            const response = await fetchAPI("/api/days", "POST", inOfficePayload);
            if (response) {
                setDays([...days, response.data]);
            }
        }
    };

    const setDayRemote = async () => {
        const formattedDate = day.toISOString().slice(0, 10);
        if (day_) {
            day_.inOffice = false;
            const response = await fetchAPI(`/api/days/${day_.id}`, "PUT", day_);
            if (response) {
                setDays([
                    ...days.filter((day: any) => day.date !== formattedDate),
                    response.data,
                ]);
            }
        } else {
            const inOfficePayload = { date: formattedDate, inOffice: false };
            const response = await fetchAPI("/api/days", "POST", inOfficePayload);
            if (response) {
                setDays([
                    ...days.filter((day: any) => day.date !== formattedDate),
                    response.data,
                ]);
            }
        }
    };

    const togglePreparedStatus = async (mealSched: any) => {
        const updatedMealSched = { ...mealSched, prepared: !mealSched.prepared };
        const response = await fetchAPI(`/api/meal-schedules/${mealSched.scheduleId}`, "PUT", updatedMealSched);
        if (response) {
            setMealsSchedule((prevMealsSchedule: any) =>
                prevMealsSchedule.map((ms: any) =>
                    ms.scheduleId === mealSched.scheduleId ? response.data : ms
                )
            );
        }
    };

    const [showAddMeal, setShowAddMeal] = useState(false);
    const [showAddLunch, setShowAddLunch] = useState(false);
    const lunchMeals = mealsSchedule.filter((mealSched: any) => {
        const mealDate = new Date(mealSched.scheduledTime);
        return (
            mealDate.toLocaleDateString() === day.toLocaleDateString() &&
            mealSched.occasion === "lunch"
        );
    });

    const nonLunchMeals = mealsSchedule.filter((mealSched: any) => {
        const mealDate = new Date(mealSched.scheduledTime);
        return (
            mealDate.toLocaleDateString() === day.toLocaleDateString() &&
            mealSched.occasion !== "lunch"
        );
    });

    return (
        <div className="md:w-1/4 w-full flex flex-col bg-[#3B465C] shadow-lg rounded-lg p-3 md:p-0 items-center relative">
            {day_?.inOffice ? (
                <div className="flex flex-row items-center justify-between bg-orange-500 text-white text-xs rounded-lg p-1 m-5 w-4/5">
                    <span className="flex items-center">
                        <FontAwesomeIcon icon={faBriefcase} className="mr-2" /> {/* Work icon */}
                        In Office
                    </span>
                    <button
                        onClick={setDayRemote}
                        className="py-1 px-3 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Remote
                    </button>
                </div>
            ) : (
                <button
                    className="self-end m-4 py-1 px-3 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => setDayInOffice()}
                >
                    Make it an Office Day
                </button>
            )}
            <h1 className="text-xl font-extrabold mb-2 text-gray-800 m-4">
                {formatDate(day)}
            </h1>
            {day_?.inOffice && (
                <div className="bg-green-500 text-white text-sm rounded-lg p-2 mb-2 w-4/5 text-center">
                    <div className="font-bold mb-2">LUNCH</div>
                    {lunchMeals.length > 0 ? (
                        <>
                            <div className="flex flex-col items-center">
                                <span className="text-white text-lg font-semibold text-center">
                                    {lunchMeals[0].meal.mealName}
                                </span>
                                <span
                                    className="text-white text-sm flex items-center cursor-pointer mt-1"
                                    onClick={() => togglePreparedStatus(lunchMeals[0])}
                                >
                                    {lunchMeals[0].prepared ? (
                                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-300 mr-1" />
                                    ) : (
                                        <FontAwesomeIcon icon={faTimesCircle} className="text-red-300 mr-1" />
                                    )}
                                    {lunchMeals[0].prepared ? "Prepared" : "Not Prepared"}
                                </span>
                                <button
                                    className="bg-red-800 text-white rounded px-2 py-1 mt-2"
                                    onClick={() => deleteScheduledMeal(lunchMeals[0].scheduleId)}
                                >
                                    X
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <button
                                className="text-blue-500 text-sm"
                                onClick={() => setShowAddLunch(!showAddLunch)}
                            >
                                Add a lunch
                            </button>

                            {showAddLunch && (
                                <ul className="mt-2">
                                    {meals.map((meal: any, idx: any) => (
                                        <li
                                            className="m-2 text-sm bg-yellow-500 p-2 rounded hover:bg-yellow-600 cursor-pointer text-black"
                                            key={idx}
                                            onClick={() => addMealToSchedule(meal, day, "lunch")}
                                        >
                                            {meal.mealName}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </div>
            )}
            <div className="flex flex-col items-center flex-grow rounded-lg w-full">
                {nonLunchMeals.length > 0 ? (
                    <ul className="m-2 rounded-lg">
                        {nonLunchMeals.map((mealSched: any, idx: any) => (
                            <li
                                key={idx}
                                className="flex flex-col items-center text-white mb-2"
                            >
                                <span className="font-medium text-lg text-center">{mealSched.meal.mealName}</span>
                                <span
                                    className="font-medium flex items-center cursor-pointer mt-1"
                                    onClick={() => togglePreparedStatus(mealSched)}
                                >
                                    {mealSched.prepared ? (
                                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-300 mr-1" />
                                    ) : (
                                        <FontAwesomeIcon icon={faTimesCircle} className="text-red-300 mr-1" />
                                    )}
                                    {mealSched.prepared ? "Prepared" : "Not Prepared"}
                                </span>
                                <button
                                    className="bg-red-800 opacity-50 text-white rounded px-2 py-1 mt-2"
                                    onClick={() => deleteScheduledMeal(mealSched.scheduleId)}
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
                    className="text-gray-500 mt-2 py-1 px-4 rounded hover:bg-blue-600"
                    onClick={() => setShowAddMeal(!showAddMeal)}
                >
                    Add Meal to Schedule
                </button>
                {showAddMeal && (
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
            {!day_?.inOffice && lunchMeals.length > 0 && (
                <>
                    <div className="bg-orange-500 text-white text-sm rounded-lg p-2 mb-2 w-4/5 text-center">
                        <div className="font-bold mb-2">LUNCH</div>
                        <div className="flex flex-col items-center">
                            <span className="text-white text-lg font-semibold text-center">
                                {lunchMeals[0].meal.mealName}
                            </span>
                            <span
                                className="text-white text-sm flex items-center cursor-pointer mt-1"
                                onClick={() => togglePreparedStatus(lunchMeals[0])}
                            >
                                {lunchMeals[0].prepared ? (
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-300 mr-1" />
                                ) : (
                                    <FontAwesomeIcon icon={faTimesCircle} className="text-red-300 mr-1" />
                                )}
                                {lunchMeals[0].prepared ? "Prepared" : "Not Prepared"}
                            </span>
                            <button
                                className="bg-red-800 text-white rounded px-2 py-1 mt-2"
                                onClick={() => deleteScheduledMeal(lunchMeals[0].scheduleId)}
                            >
                                X
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DaySchedule;
