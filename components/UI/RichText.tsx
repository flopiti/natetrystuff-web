// Front-end Good Practice: https://web.dev/learn/
import { useState } from 'react'; 

export default function RichTextBox() {
  const [content, setContent] = useState('');
  return (
    <div className="relative py-4 m-5 border-black border-[1px] font-Orbitron text-xs font-bold w-96 h-48 flex flex-col">
      <textarea className="flex-1 p-2 resize-none" value={content} onChange={(e) => setContent(e.target.value)} />
      <button className="absolute bottom-2 left-2" onClick={() => console.log('Posting:', content)}>
        &#x23CE;
      </button>
    </div>
  );
}
