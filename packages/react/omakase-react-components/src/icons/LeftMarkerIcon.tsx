import React from "react";
import { IconProps } from "./icons";

export const LeftMarkerIcon = ({ width, height }: IconProps) => {
  return (
    <svg
      width={width ?? 24}
      height={height ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11.3475 3H5.775V21L11.3475 17.0475V3Z" fill="#CACFEA" />
      <path
        d="M18.225 21L12.6525 17.0475V3H18.225V21ZM13.7775 16.47L17.1 18.825V4.125H13.7775V16.47Z"
        fill="#CACFEA"
      />
    </svg>
  );
};
