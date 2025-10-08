import React from "react";

const AlreadyJoinedIllustration = () => {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="90" fill="#f7fee7" opacity="0.5" />

      {/* Group of people */}
      {/* Person 1 */}
      <circle cx="70" cy="80" r="18" fill="#84cc16" opacity="0.3" />
      <path d="M50 130 Q70 110 90 130" fill="#84cc16" opacity="0.3" />

      {/* Person 2 (center - highlighted) */}
      <circle cx="100" cy="75" r="20" fill="#84cc16" />
      <path d="M78 130 Q100 105 122 130" fill="#84cc16" />

      {/* Person 3 */}
      <circle cx="130" cy="80" r="18" fill="#84cc16" opacity="0.3" />
      <path d="M110 130 Q130 110 150 130" fill="#84cc16" opacity="0.3" />

      {/* Check mark badge */}
      <circle
        cx="120"
        cy="55"
        r="22"
        fill="white"
        stroke="#84cc16"
        strokeWidth="3"
      />
      <circle cx="120" cy="55" r="18" fill="#ecfccb" />
      <path
        d="M112 55 L117 60 L128 49"
        stroke="#84cc16"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Decorative sparkles */}
      <path
        d="M40 60 L42 65 L47 67 L42 69 L40 74 L38 69 L33 67 L38 65 Z"
        fill="#84cc16"
        opacity="0.4"
      />
      <path
        d="M160 100 L161 103 L164 104 L161 105 L160 108 L159 105 L156 104 L159 103 Z"
        fill="#84cc16"
        opacity="0.4"
      />
      <path
        d="M50 140 L51 142 L53 143 L51 144 L50 146 L49 144 L47 143 L49 142 Z"
        fill="#84cc16"
        opacity="0.4"
      />
    </svg>
  );
};

export default AlreadyJoinedIllustration;
