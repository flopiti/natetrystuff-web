import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface DropdownProps<T> {
    onSelect: (option: T) => void;
    options: T[];
    selectedOption?: T | null;
    labelKey: keyof T; 
}

const Dropdown = <T,>({ options, onSelect, selectedOption, labelKey }: DropdownProps<T>) => {
    const [opened, setOpened] = useState(false);

    const dropdownVariants = {
        hidden: { height: 0, opacity: 0 },
        visible: { 
            height: 'auto', 
            opacity: 1, 
            transition: { 
                staggerChildren: 0.1, 
                duration: 0.5
            } 
        },
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.3 }
        },
    };

    const displayVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    const toggleDropdown = () => {
        setOpened(prev => !prev);
    };

    return (
        <div
            className={`py-4 m-5 ${selectedOption ? '' : 'border-black border-[1px]'} font-Orbitron text-xs font-bold w-[10rem] text-center cursor-pointer`}
            onMouseEnter={() => setOpened(true)}
            onMouseLeave={() => setOpened(false)}
        >
            <AnimatePresence mode="wait">
                {selectedOption ? (
                    <motion.div
                        key="project"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={displayVariants}
                        onClick={toggleDropdown}
                        className='flex items-center justify-center gap-4'
                    >
                        <FontAwesomeIcon icon={faGithub as IconProp} size='2xl' />
                        <span>{String(selectedOption[labelKey])}</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="select"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={displayVariants}
                    >
                        Select
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {opened && (
                    <motion.div
                        className='flex flex-col items-center'
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                        style={{ overflow: 'hidden' }}
                    >
                        {options.map((item, index) => (
                            <motion.button
                                className={`py-1 block text-center w-full${index === 0 ? ' mt-4' : ''}`}
                                key={index}
                                variants={itemVariants}
                                onClick={() => {
                                    onSelect(item);
                                    setOpened(false);
                                }}
                            >
                                {String(item[labelKey])}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dropdown;
