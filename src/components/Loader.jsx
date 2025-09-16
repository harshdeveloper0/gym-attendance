"use client";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-50">
      {/* Spinning circles */}
      <div className="relative w-16 h-16">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1 + i * 0.2,
              ease: "linear",
              delay: i * 0.1,
            }}
            style={{ transformOrigin: "center" }}
          />
        ))}
      </div>
      <p className="mt-4 text-white font-medium text-sm sm:text-base">
        Loading members...
      </p>
    </div>
  );
}
