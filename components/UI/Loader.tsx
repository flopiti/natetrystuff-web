import { motion } from "framer-motion";

const grid = [
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
];
  
interface LoaderProps {
    loading: boolean;
    className?: string;
}

const Loader = ({ loading, className }: LoaderProps) => {
    return (
    <span className={className}>
        {grid.map((row, i) => (
        <span key={i} className="flex">
            {row.map((col, j) =>
            col ? (
                <motion.span
                key={j}
                className="w-[0.1275rem] h-[0.1275rem] m-[0.0625rem] rounded-full"
                initial={{ backgroundColor: "#000000" }}
                animate={
                    loading
                    ? {
                        backgroundColor: ["#000000", "#53DD6C", "#000000"],
                        transition: {
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random()
                        }
                    }
                    : {}
                }
                />
            ) : 
            <span key={j} className="w-[0.1275rem] h-[0.1275rem] m-[0.0625rem] rounded-full bg-transparent" /> )
            }
        </span>
        ))}
    </span>
    );
}
    
export default Loader;