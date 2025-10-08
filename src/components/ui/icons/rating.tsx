import React from "react";

interface RatingProps {
  rating: number;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({ rating, className }) => {
  const totalStars = 5;

  return (
    <div className="flex gap-1">
      {[...Array(totalStars)].map((_, index) => {
        const fillPercentage = Math.min(Math.max(rating - index, 0), 1) * 100;

        return (
          <div
            key={index}
            className={`relative ${className ? className : "h-7 w-7"}`}
          >
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 24 24">
              <path
                fill="gray"
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 24 24"
              style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}
            >
              <defs>
                <linearGradient
                  id={`goldGradient-${index}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#FFF700" />
                  <stop offset="40%" stopColor="#FFD700" />
                  <stop offset="70%" stopColor="#FFA500" />
                  <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#goldGradient-${index})`}
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

export default Rating;
