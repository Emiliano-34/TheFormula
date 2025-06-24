import { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 56
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const { days, hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) return { ...prevTime, seconds: seconds - 1 };
        if (minutes > 0) return { ...prevTime, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { ...prevTime, hours: hours - 1, minutes: 59, seconds: 59 };
        if (days > 0) return { days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        
        clearInterval(timer);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown">
      <div>Días <span>{timeLeft.days.toString().padStart(2, '0')}</span></div>
      <div>Horas <span>{timeLeft.hours.toString().padStart(2, '0')}</span></div>
      <div>Minutos <span>{timeLeft.minutes.toString().padStart(2, '0')}</span></div>
      <div>Segundos <span>{timeLeft.seconds.toString().padStart(2, '0')}</span></div>
    </div>
  );
};

export default CountdownTimer;