import React from "react";
import { IconProps } from "./icons";

export const DeleteMarkerIcon = ({ width, height }: IconProps) => {
  return (
    <svg
      width={width ?? 24}
      height={height ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.39001 3V21L12 17.0175L17.61 21V3H6.38251H6.39001ZM16.44 3.84L7.23001 18.7125V3.84H16.44ZM12 15.9975L8.25751 18.6525L16.77 4.89V19.3725L12 15.9825V15.9975Z"
        fill="#CACFEA"
      />
    </svg>
  );
};
