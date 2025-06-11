import React from "react";
import { IconProps } from "./icons";

export const RightBracketIcon = ({ width, height }: IconProps) => {
  return (
    <svg
      width={width ?? 24}
      height={height ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.8325 21C10.1625 21 10.4325 20.73 10.4325 20.4V16.7925L14.7675 12.3675L10.4325 8.235V3.6C10.4325 3.27 10.1625 3 9.8325 3C9.5025 3 9.2325 3.27 9.2325 3.6V8.7525L13.0575 12.3975L9.2325 16.305V20.4C9.2325 20.73 9.5025 21 9.8325 21Z"
        fill="#CACFEA"
      />
    </svg>
  );
};
