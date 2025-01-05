import { ReactNode } from "react";

 
interface ButtonProps {
    onClick: () => void;
    children: ReactNode;
}

const CustomButton =  (props: ButtonProps) => {
    return <button className="px-12 py-4 border-black border-[1px] font-Orbitron text-xs font-bold " {...props} />;
    }
export default CustomButton;