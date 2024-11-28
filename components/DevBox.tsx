import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface DevBoxProps {
    name: string;
    isRunning: boolean | null;
    start: () => void;
    stop: () => void;
}

const DevBox = ({  name,isRunning, start, stop }:DevBoxProps) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    
    return (
        <div  
            id='api-box'
            className="flex flex-row items-center border-2 border-white"
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
        >
            {isRunning !== null && (
                <motion.div
                    className="w-10 h-10 flex items-center justify-center"
                    animate={isRunning ? { rotate: 360 } : {}}
                    transition={isRunning ? { repeat: Infinity, duration: 4, ease: "linear" } : {}}
                >
                    <FontAwesomeIcon 
                        size="xl" 
                        icon={isRunning ? faArrowsRotate : faTimesCircle} 
                    />
                </motion.div>
            )}
            <div className='text-white p-2 rounded shadow-lg'>
                {name}
            </div>
            {isHovered && (
                <motion.div
                    className="w-full h-full flex items-center justify-center bg-opacity-50 bg-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {isRunning ? (
                        <motion.button 
                            className="bg-red-500 text-whiterounded w-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 120 }}
                            onClick={() => stop}
                        >
                            Stop
                        </motion.button>
                    ) : (
                        <motion.button 
                            className="bg-green-500 text-white p-2 mx-2 rounded w-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 120 }}
                            onClick={() => start()} 
                        >
                            Start
                        </motion.button>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default DevBox;
