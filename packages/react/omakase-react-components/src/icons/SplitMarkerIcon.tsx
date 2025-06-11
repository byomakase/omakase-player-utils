import React from "react";
import { IconProps } from "./icons";

export const SplitMarkerIcon = ({ width, height }: IconProps) => {
  return (
    <svg
      width={width ?? 24}
      height={height ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.6875 3V21L8.0625 17.0475L11.4375 21V3H4.6875Z"
        fill="#CACFEA"
      />
      <path
        d="M12.5625 3V21L15.9375 17.0475L19.3125 21V3H12.5625Z"
        fill="#CACFEA"
      />
    </svg>
  );
};
