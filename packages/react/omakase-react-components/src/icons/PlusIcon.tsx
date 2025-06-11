import React from "react";
import { IconProps } from "./icons";

export const PlusIcon = ({ width, height }: IconProps) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="13" height="13" rx="2.5" stroke="#CACFEA" />
      <path
        d="M7.16667 6.33333V6.83333H7.66667H10.3333C10.4257 6.83333 10.5 6.90769 10.5 7C10.5 7.09231 10.4257 7.16667 10.3333 7.16667H7.66667H7.16667V7.66667V10.3333C7.16667 10.4257 7.09231 10.5 7 10.5C6.90769 10.5 6.83333 10.4257 6.83333 10.3333V7.66667V7.16667H6.33333H3.66667C3.57468 7.16667 3.5 7.09199 3.5 7C3.5 6.90801 3.57468 6.83333 3.66667 6.83333H6.33333H6.83333V6.33333V3.66667C6.83333 3.57468 6.90801 3.5 7 3.5C7.09199 3.5 7.16667 3.57468 7.16667 3.66667V6.33333Z"
        fill="#CACFEA"
        stroke="#CACFEA"
      />
    </svg>
  );
};
