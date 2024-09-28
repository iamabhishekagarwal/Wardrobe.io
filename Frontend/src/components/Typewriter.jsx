import React, { useEffect, useState } from 'react';

const Typewriter = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState('');
  let index = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedText((prev) => {
        if (index < text.length) {
          const next = prev + text[index];
          index += 1;
          return next;
        }
        clearInterval(interval);
        return prev;
      });
    }, speed);

    return () => clearInterval(interval); // Cleanup the interval
  }, [text, speed]);

  return <span>{displayedText}</span>;
};

export default Typewriter;
