import React from "react";
import { IconProps } from "./icons";

export const RightMarkerIcon = ({ width, height }: IconProps) => {
  return (
    <svg
      width={width ?? 24}
      height={height ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.6525 17.0475L18.225 21V3H12.6525V17.0475Z" fill="#CACFEA" />
      <path
        d="M5.775 3H11.3475V17.0475L5.775 21V3ZM10.2225 4.125H6.9V18.825L10.2225 16.47V4.125Z"
        fill="#CACFEA"
      />
    </svg>
  );
};
