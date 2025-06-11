import React from "react";
import { IconProps } from "./icons";

export const LeftBracketIcon = ({ width, height }: IconProps) => {
  return (
    <svg
      width={width ?? 24}
      height={height ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.1675 21C13.8375 21 13.5675 20.73 13.5675 20.4V16.7925L9.2325 12.3675L13.5675 8.235V3.6C13.5675 3.27 13.8375 3 14.1675 3C14.4975 3 14.7675 3.27 14.7675 3.6V8.7525L10.9425 12.3975L14.7675 16.305V20.4C14.7675 20.73 14.4975 21 14.1675 21Z"
        fill="#CACFEA"
      />
    </svg>
  );
};
