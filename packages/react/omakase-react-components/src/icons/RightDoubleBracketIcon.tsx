import React from "react";
import { IconProps } from "./icons";

export const RightDoubleBracketIcon = ({ width, height }: IconProps) => {
  return (
    <svg
      width={width ?? 24}
      height={height ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.4325 21C13.7625 21 14.0325 20.73 14.0325 20.4V16.7925L18.3675 12.3675L14.0325 8.235V3.6C14.0325 3.27 13.7625 3 13.4325 3C13.1025 3 12.8325 3.27 12.8325 3.6V8.7525L16.6575 12.3975L12.8325 16.305V20.4C12.8325 20.73 13.1025 21 13.4325 21Z"
        fill="#CACFEA"
      />
      <path
        d="M6.2325 17.145C6.39 17.145 6.54 17.085 6.66 16.965L11.1675 12.3675L6.645 8.0625C6.405 7.8375 6.0225 7.845 5.7975 8.085C5.5725 8.325 5.58 8.7075 5.82 8.9325L9.4575 12.3975L5.805 16.125C5.5725 16.365 5.58 16.74 5.8125 16.9725C5.925 17.085 6.0825 17.145 6.2325 17.145Z"
        fill="#CACFEA"
      />
    </svg>
  );
};
