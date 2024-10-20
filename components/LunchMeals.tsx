import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const LunchMeals = ({
    lunchMeals,
    showAddLunch,
    setShowAddLunch,
    meals,
    day,
    togglePreparedStatus,
    deleteScheduledMeal,
    addMealToSchedule,
    buttonVariants,
    preparedVariants,
    listVariants,
    itemVariants
}: any) => {
    return (
        <motion.div
            className="bg-green-500 overflow-hidden text-white text-sm rounded-lg p-2 mb-2 w-4/5 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="font-bold mb-2">LUNCH</div>
            <AnimatePresence>
                {lunchMeals.length > 0 ? (
                    <motion.div
                        className="flex flex-col items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <span className="text-white text-lg font-semibold text-center">
                            {lunchMeals[0].meal.mealName}
                        </span>
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={lunchMeals[0].prepared ? "prepared" : "not-prepared"}
                                className="text-white text-sm flex items-center cursor-pointer mt-1"
                                onClick={() => togglePreparedStatus(lunchMeals[0])}
                                variants={preparedVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                {lunchMeals[0].prepared ? (
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-300 mr-1" />
                                ) : (
                                    <FontAwesomeIcon icon={faTimesCircle} className="text-red-300 mr-1" />
                                )}
                                {lunchMeals[0].prepared ? "Prepared" : "Not Prepared"}
                            </motion.span>
                        </AnimatePresence>
                        <motion.button
                            className="bg-red-800 text-white rounded px-2 py-1 mt-2"
                            onClick={() => deleteScheduledMeal(lunchMeals[0].scheduleId)}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            X
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.button
                        className="text-blue-500 text-sm"
                        onClick={() => setShowAddLunch(!showAddLunch)}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Add a lunch
                    </motion.button>

                    <AnimatePresence>
                        {showAddLunch && (
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
                                        onClick={() => addMealToSchedule(meal, day, "lunch")}
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
                        )}
                    </AnimatePresence>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default LunchMeals;