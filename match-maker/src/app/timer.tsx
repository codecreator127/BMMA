import React, { useState, useEffect } from "react";

const Timer: React.FC = () => {
  const [time, setTime] = useState(60 * 1);
  const [isRunning, setIsRunning] = useState(false);
  const [inputTime, setInputTime] = useState(1);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      if (timer) clearInterval(timer);
      const audio = new Audio("https://www.myinstants.com/media/sounds/bell.mp3");
      audio.play();
    }
    return () => timer && clearInterval(timer);
  }, [isRunning, time]);
  

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTime(inputTime * 60);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTime(Number(e.target.value));
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold">Countdown: {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}</h1>
      <input
        type="number"
        value={inputTime}
        onChange={handleChange}
        className="px-2 py-1 border border-gray-300 rounded-lg"
      />
      <div className="flex gap-2">
        {!isRunning ? (
          <button onClick={startTimer} className="px-4 py-2 bg-green-500 text-white rounded-lg">Start</button>
        ) : (
          <button onClick={pauseTimer} className="px-4 py-2 bg-yellow-500 text-white rounded-lg">Pause</button>
        )}
        <button onClick={resetTimer} className="px-4 py-2 bg-red-500 text-white rounded-lg">Reset</button>
      </div>
    </div>
  );
};

export default Timer;
