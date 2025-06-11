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

import {
  HelpMenuGroup,
  HelpMenuItem,
  OmakasePlayer,
} from "@byomakase/omakase-player";
import { UserAgent } from "../../types/user-agent";

export class OmakasePlayerTimelineHotKeyHandler {
  public actionZoomIn?: () => void;
  public actionZoomOut?: () => void;
  public actionResetZoom?: () => void;
  public actionToggleNextAudioTrack?: () => void;
  public actionTogglePreviousAudioTrack?: () => void;
  public actionToggleCti?: () => void;

  public getKeyboardShortcutsHelpMenuGroup(): HelpMenuGroup {
    let keyCombination = (...keys: string[]) => {
      return keys.join(" + ");
    };

    let shiftKey = "shift".toUpperCase();

    let helpMenuItems: HelpMenuItem[] = [
      {
        description: "Timeline Zoom In",
        name: keyCombination("="),
      },

      {
        description: "Timeline Zoom Out",
        name: keyCombination("-"),
      },

      {
        description: "Timeline Zoom level 100%",
        name: keyCombination("0"),
      },

      {
        description: "Toggle Next Audio Track",
        name: keyCombination(shiftKey, "e"),
      },

      {
        description: "Toggle Previous Audio Track",
        name: keyCombination("e"),
      },

      {
        description: "Toggle CTI into / out-of Interactive Mode",
        name: keyCombination("'"),
      },
    ];

    return {
      name: "Timeline function shortcuts",
      items: helpMenuItems,
    };
  }

  public handleKeyboardEvent(event: KeyboardEvent): boolean {
    let config = {
      zoomStep: 200,
      volumeStep: 0.1,
    };

    const targetElement = event.target as HTMLElement;
    const formInputs = ["INPUT", "TEXTAREA", "OMAKASE-MARKER-LIST"];
    if (formInputs.includes(targetElement.tagName.toUpperCase())) {
      return false;
    }

    if (
      event.code === "Equal" &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      this.actionZoomIn && this.actionZoomIn();
      return true;
    }

    if (
      event.code === "Minus" &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      this.actionZoomOut && this.actionZoomOut();
      return true;
    }

    if (
      event.code === "Digit0" &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      this.actionResetZoom && this.actionResetZoom();
      return true;
    }

    if (event.code === "KeyE" && !event.ctrlKey && !event.metaKey) {
      if (event.shiftKey) {
        this.actionToggleNextAudioTrack && this.actionToggleNextAudioTrack();
      } else {
        this.actionTogglePreviousAudioTrack &&
          this.actionTogglePreviousAudioTrack();
      }

      return true;
    }

    if (
      event.code === "Quote" &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      this.actionToggleCti && this.actionToggleCti();
      return true;
    }

    return false;
  }
}
