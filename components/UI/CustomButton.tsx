import { ReactNode } from "react";

interface ButtonProps {
    onClick: () => void;
    children: ReactNode;
}

const CustomButton =  ({onClick, children, className = ""}: ButtonProps & { className?: string }) => {
    return <button className={`px-8 py-2 border-black border-[1px] font-Orbitron text-xs font-bold ${className}`} onClick={onClick}>{children}</button>
}
export default CustomButton;