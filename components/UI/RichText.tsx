// Front-end Good Practice: https://web.dev/learn/
import { useState } from 'react'; import { motion } from 'framer-motion';

interface RichTextBoxProps {
  text: string| null;
  handleSubmit: (text:string) => void;
}

export default function RichTextBox( {text, handleSubmit} : RichTextBoxProps ) {
  const [content, setContent] = useState(text || '');
  const [focused, setFocused] = useState(false);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(content);
      e.currentTarget.blur();
    }
  };

  return (
    <div className="relative py-4 m-5 w-96 h-48">
      <motion.textarea 
        className="w-full h-full p-2 resize-none border-black focus:outline-none font-Orbitron text-xs border-[1px]" 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        onFocus={() => setFocused(true)} 
        onBlur={() => setFocused(false)} 
        animate={{ boxShadow: focused ? '0 0 10px rgba(0,0,0,0.5)' : 'none' }} 
        transition={{ duration: 0.3 }}
        onKeyDown={handleKeyDown}
      />
      <button className="absolute bottom-[1.25rem] right-[1rem]" onClick={() => handleSubmit(content)}>&#x23CE;</button>
    </div>
  );
}
