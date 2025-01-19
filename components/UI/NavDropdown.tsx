import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppNames } from '@/app/constants/global';

interface NavDropdownProps {
    setPage: (page: string) => void;
}

const NavDropdown = ({ setPage }: NavDropdownProps) => {
  const [hovered, setHovered] = useState(false);
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
      className="py-4 m-5 border-black border-[1px] font-Orbitron text-xs font-bold absolute top-0 right-0 w-[5rem] text-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div>Nav</div>
      <AnimatePresence>
        {hovered && (
          <motion.div
            className='flex flex-col items-center'
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            style={{ overflow: 'hidden' }}
          >
            {AppNames.map((item, index) => (
              <motion.button
                className={`py-1 block text-center w-full${index === 0 ? ' mt-4' : ''}`}
                key={index}
                variants={itemVariants}
                onClick={() => setPage(item)}
              >
                {item}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavDropdown;
