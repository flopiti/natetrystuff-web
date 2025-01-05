import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NavDropdown = () => {
  const [hovered, setHovered] = useState(false);
  
  const items = ["sched", "meals", "code", "chess", "todo", "text"];

  // Variants for the container to handle staggered children animations
  const containerVariants = {
    initial: {},
    hovered: { 
      transition: { 
        staggerChildren: 0.2, // Stagger each child by 0.2 seconds
      },
    },
  };

  // Variants for each dropdown item
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="py-4 m-5 border-black border-[1px] font-Orbitron text-xs font-bold absolute top-0 right-0 w-[5rem] text-center overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      variants={containerVariants}
      initial="initial"
      animate={hovered ? "hovered" : "initial"}
      layout // Enables automatic layout animations
    >
      <div>Nav</div>
      
      {/* AnimatePresence handles the mounting and unmounting animations */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className='my-2'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {items.map((item, index) => (
              <motion.button
                className='py-1 block text-center w-full'
                key={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {item}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NavDropdown;
