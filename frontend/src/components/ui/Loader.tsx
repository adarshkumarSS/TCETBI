import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface LoaderProps {
  targetNumber: number;
  duration?: number;
  suffix?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  targetNumber,
  duration = 2000,
  suffix = "",
}) => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true }); // 👈 trigger once when visible

  useEffect(() => {
    if (!isInView) return; // only start counting when visible

    let start = 0;
    const increment = targetNumber / (duration / 50);

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetNumber) {
        start = targetNumber;
        clearInterval(timer);
      }
      setCurrentNumber(start);
    }, 50);

    return () => clearInterval(timer);
  }, [isInView, targetNumber, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        fontFamily: "Poppins, sans-serif",
        fontWeight: 700,
        color: "hsl(0 84.2% 60.2%)",
        fontSize: "2rem",
        textAlign: "center",
      }}
    >
      {Math.floor(currentNumber)}
      {suffix}
    </motion.div>
  );
};