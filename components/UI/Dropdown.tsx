import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownProps<T> {
    onSelect: (option: T) => void;
    options: T[];
    selectedOption?: T;
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
      transition: { duration: 1}
    },
  };
  
  return (
    <div
      className="py-4 m-5 border-black border-[1px] font-Orbitron text-xs font-bold w-[5rem] text-center"
      onMouseEnter={() => setOpened(true)}
      onMouseLeave={() => setOpened(false)}
    >
      <div>
        {
            selectedOption ? String(selectedOption[labelKey]) : 'Select'
        }
        </div>
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
            {options?.map((item, index) => (
              <motion.button
                className={`py-1 block text-center w-full${index === 0 ? ' mt-4' : ''}`}
                key={index}
                variants={itemVariants}
                onClick={() => onSelect(item)}
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
