// app/(custom)/order/OrderingCountdown.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const calculateTimeRemaining = () => {
  const now = new Date();
  const nextMonday = new Date(now);
  
  const daysUntilMonday = (1 - now.getDay() + 7) % 7;
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  
  // If it's already Monday and past 8 PM, set the countdown for the *next* Monday
  if (now.getDay() === 1 && now.getHours() >= 20) {
    nextMonday.setDate(nextMonday.getDate() + 7);
  }
  
  // Set time to 8 PM on that calculated Monday
  nextMonday.setHours(20, 0, 0, 0);

  const difference = nextMonday.getTime() - now.getTime();
  
  let timeRemaining = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  if (difference > 0) {
    timeRemaining = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  
  return timeRemaining;
};

const OrderingCountdown = () => {
  const [time, setTime] = useState(calculateTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = calculateTimeRemaining();
      setTime(newTime);

      // If the countdown is over, reload the page to check for ordering status
      if (Object.values(newTime).every(val => val === 0)) {
        window.location.reload();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl w-full">
        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">Ordering is Temporarily Disabled</h1>
        <p className="text-gray-600 mt-2 mb-6">
          Our ordering window opens every Monday at 8:00 PM. Please check back then to place your order.
        </p>
        <div className="flex justify-center gap-4 text-gray-800 font-bold text-xl">
          <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
            <span>{time.days}</span>
            <span className="text-sm font-normal">Days</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
            <span>{time.hours}</span>
            <span className="text-sm font-normal">Hours</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
            <span>{time.minutes}</span>
            <span className="text-sm font-normal">Minutes</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
            <span>{time.seconds}</span>
            <span className="text-sm font-normal">Seconds</span>
          </div>
        </div>
        <div className="mt-8">
          <a href="/" className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
            Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderingCountdown;