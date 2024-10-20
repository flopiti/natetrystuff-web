import { fetchAPI, formatDate } from "@/app/utils";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from "framer-motion";
import LunchMeals from './LunchMeals';

const DaySchedule = ({
    day,
    meals,
    mealsSchedule,
    addMealToSchedule,
    deleteScheduledMeal,
    day_,
    setMealsSchedule,
    setDayInOffice,
    setDayRemote,
}: any) => {

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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, y: -50, transition: { duration: 0.3 } }
    };

    const listVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: "auto" },
        exit: { opacity: 0, height: 0 }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
    };

    const buttonVariants = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    };

    const preparedVariants = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
        transition: { duration: 0.3 }
    };

    return (
        <motion.div
            className="md:w-1/4 w-full h-full flex flex-col bg-[#3B465C] shadow-lg rounded-lg p-3 md:p-0 items-center relative overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {day_?.inOffice ? (
                <motion.div
                    key="inOffice"
                    className="flex flex-row items-center justify-between bg-orange-500 text-white text-xs rounded-lg p-1 m-5 w-4/5"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.2 }}
                >
                    <span className="flex items-center">
                        <FontAwesomeIcon icon={faBriefcase} className="mr-2" /> {/* Work icon */}
                        In Office
                    </span>
                    <motion.button
                        onClick={setDayRemote}
                        className="py-1 px-3 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Remote
                    </motion.button>
                </motion.div>
            ) : (
                <motion.button
                    key="remote"
                    className="self-end m-4 py-1 px-3 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => setDayInOffice()}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                >
                    Make it an Office Day
                </motion.button>
            )}

            <h1 className="text-xl font-extrabold mb-2 text-gray-800 m-4">
                {formatDate(day)}
            </h1>
            {day_?.inOffice && (
                <LunchMeals
                    lunchMeals={lunchMeals}
                    showAddLunch={showAddLunch}
                    setShowAddLunch={setShowAddLunch}
                    meals={meals}
                    day={day}
                    togglePreparedStatus={togglePreparedStatus}
                    deleteScheduledMeal={deleteScheduledMeal}
                    addMealToSchedule={addMealToSchedule}
                    buttonVariants={buttonVariants}
                    preparedVariants={preparedVariants}
                    listVariants={listVariants}
                    itemVariants={itemVariants}
                />
            )}
            <div className="flex flex-col items-center flex-1 rounded-lg w-full overflow-hidden p-4">
                <AnimatePresence>
                    {nonLunchMeals.length > 0 ? (
                        <motion.ul
                            className="m-2 rounded-lg"
                            variants={listVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {nonLunchMeals.map((mealSched: any, idx: any) => (
                                <motion.li
                                    key={idx}
                                    className="flex flex-col items-center text-white mb-2"
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="font-medium text-lg text-center">{mealSched.meal.mealName}</span>
                                    <img src={mealSched.meal.imageUrl} alt={mealSched.meal.mealName} className="w-16 h-16 mt-2 rounded-full" />
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={mealSched.prepared ? "prepared" : "not-prepared"}
                                            className="font-medium flex items-center cursor-pointer mt-1"
                                            onClick={() => togglePreparedStatus(mealSched)}
                                            variants={preparedVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                        >
                                            {mealSched.prepared ? (
                                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-300 mr-1" />
                                            ) : (
                                                <FontAwesomeIcon icon={faTimesCircle} className="text-red-300 mr-1" />
                                            )}
                                            {mealSched.prepared ? "Prepared" : "Not Prepared"}
                                        </motion.span>
                                    </AnimatePresence>
                                    <motion.button
                                        className="bg-red-800 opacity-50 text-white rounded px-2 py-1 mt-2"
                                        onClick={() => deleteScheduledMeal(mealSched.scheduleId)}
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        X
                                    </motion.button>
                                </motion.li>
                            ))}
                        </motion.ul>
                    ) : (
                        <motion.p
                            className="text-gray-500 m-2 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            No meals scheduled
                        </motion.p>
                    )}
                </AnimatePresence>
                <motion.button
                    className="text-gray-500 mt-2 py-1 px-4 rounded hover:bg-blue-600"
                    onClick={() => setShowAddMeal(!showAddMeal)}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    Add Meal to Schedule
                </motion.button>
                <AnimatePresence>
                    {showAddMeal && (
                        <div className="flex-1 overflow-auto w-full">

                        <motion.ul
                            className="mt-2"
                            variants={listVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {meals.map((meal: any, idx: any) => (
                                <motion.li
                                    className="m-2 text-sm bg-yellow-500 p-2 rounded hover:bg-yellow-600 cursor-pointer text-black"
                                    key={idx}
                                    onClick={() => addMealToSchedule(meal, day)}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {meal.mealName}
                                </motion.li>
                            ))}
                        </motion.ul>
                        </div>
                    )}
                </AnimatePresence>
            </div>
            {!day_?.inOffice && lunchMeals.length > 0 && (
                <LunchMeals
                    lunchMeals={lunchMeals}
                    showAddLunch={showAddLunch}
                    setShowAddLunch={setShowAddLunch}
                    meals={meals}
                    day={day}
                    togglePreparedStatus={togglePreparedStatus}
                    deleteScheduledMeal={deleteScheduledMeal}
                    addMealToSchedule={addMealToSchedule}
                    buttonVariants={buttonVariants}
                    preparedVariants={preparedVariants}
                    listVariants={listVariants}
                    itemVariants={itemVariants}
                />
            )}
        </motion.div>
    );
};

export default DaySchedule;
