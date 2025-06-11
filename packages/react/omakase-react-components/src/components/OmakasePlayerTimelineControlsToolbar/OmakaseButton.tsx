/*
 * Copyright 2025 ByOmakase, LLC (https://byomakase.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import { IconProps } from "../../icons/icons";
import "./OmakaseButton.css";

interface OmakaseButtonProps {
  Icon: React.ComponentType<IconProps>; // Accepts an icon component
  width?: number;
  height?: number;
  text?: string;
  onClick: () => void;
  disabled?: boolean;
}

export const OmakaseButton = ({
  Icon,
  onClick,
  width,
  height,
  text,
  disabled,
}: OmakaseButtonProps) => {
  return (
    <button disabled={disabled} onClick={onClick}>
      <Icon width={width} height={height} /> {text}
    </button>
  );
};
