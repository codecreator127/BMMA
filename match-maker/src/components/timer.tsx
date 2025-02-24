import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlayCircle, PauseCircle, RotateCcw } from "lucide-react";

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
    <div className="flex items-center gap-4">
      <div className="text-2xl font-semibold min-w-[100px] text-center">
        {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
      </div>
      
      <Input
        type="number"
        value={inputTime}
        onChange={handleChange}
        className="w-20 text-center"
        min={1}
      />
      
      {!isRunning ? (
        <Button
          onClick={startTimer}
          variant="default"
          size="sm"
        >
          <PlayCircle className="mr-2 h-4 w-4" />
          Start
        </Button>
      ) : (
        <Button
          onClick={pauseTimer}
          variant="secondary"
          size="sm"
        >
          <PauseCircle className="mr-2 h-4 w-4" />
          Pause
        </Button>
      )}
      
      <Button
        onClick={resetTimer}
        variant="destructive"
        size="sm"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset
      </Button>
    </div>
  );
};

export default Timer;