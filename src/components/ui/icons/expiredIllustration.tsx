import React from "react";

const ExpiredLinkIllustration = () => {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <circle cx="100" cy="100" r="90" fill="#f7fee7" opacity="0.5" />

      <rect
        x="50"
        y="70"
        width="100"
        height="70"
        rx="8"
        fill="#84cc16"
        opacity="0.2"
      />
      <path
        d="M50 78 L100 108 L150 78"
        stroke="#84cc16"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <rect
        x="50"
        y="70"
        width="100"
        height="70"
        rx="8"
        stroke="#84cc16"
        strokeWidth="3"
        fill="none"
      />

      <circle
        cx="130"
        cy="60"
        r="25"
        fill="white"
        stroke="#ef4444"
        strokeWidth="3"
      />
      <circle cx="130" cy="60" r="20" fill="#fef2f2" />

      <line
        x1="130"
        y1="60"
        x2="130"
        y2="50"
        stroke="#ef4444"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="130"
        y1="60"
        x2="138"
        y2="60"
        stroke="#ef4444"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <line
        x1="70"
        y1="100"
        x2="90"
        y2="120"
        stroke="#ef4444"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="90"
        y1="100"
        x2="70"
        y2="120"
        stroke="#ef4444"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <circle cx="30" cy="40" r="4" fill="#84cc16" opacity="0.3" />
      <circle cx="170" cy="160" r="6" fill="#84cc16" opacity="0.3" />
      <circle cx="160" cy="30" r="3" fill="#84cc16" opacity="0.3" />
    </svg>
  );
};

export default ExpiredLinkIllustration;
