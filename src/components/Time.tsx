import React, { useEffect, useState } from "react";

const Time = () => {
  type NewType = Intl.DateTimeFormatOptions;

  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();

    const options = {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    } as NewType;
    return `${now.toLocaleDateString(
      undefined,
      options
    )} ${now.toLocaleTimeString()}`; // Combined format with day
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      } as NewType;
      setCurrentTime(
        `${now.toLocaleDateString(
          undefined,
          options
        )} ${now.toLocaleTimeString()}`
      ); // Update time with day
    }, 1000);

    // Cleanup function to clear the interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  return (
    <h2 className="text-xl text-gray-500 font-semibold mx-8 my-2">
      {" "}
      {currentTime}{" "}
    </h2>
  );
};

export default Time;
