import { motion } from "framer-motion";

const LoadingComponent = ({ message = "Loading" }: { message?: string }) => {
  return (
    <div className="flex w-full h-full flex-col items-center justify-center gap-4">
      {/* Animated SVG */}
      <img
        src="/animations/LandcareAnimation.svg"
        alt="Loading animation"
        width={600}
        aria-hidden="true"
      />

      {/* Dot typing animation */}
      <div className="flex items-center gap-1 text-lg font-medium text-gray-600">
        <span>{message}</span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
        >
          .
        </motion.span>
      </div>
    </div>
  );
};

export default LoadingComponent;
