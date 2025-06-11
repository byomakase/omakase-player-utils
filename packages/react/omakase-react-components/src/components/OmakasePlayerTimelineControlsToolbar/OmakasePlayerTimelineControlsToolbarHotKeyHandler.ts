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
import { UserAgentUtil } from "../../util/user-agent-util";

export class OmakasePlayerTimelineControlsToolbarHotKeyHandler {
  public actionMarkerInOut?: () => void;
  public actionMarkerSplit?: () => void;
  public actionMarkerDelete?: () => void;
  public actionPreviousMarkerToggle?: () => void;
  public actionNextMarkerToggle?: () => void;
  public actionSetMarkerStartToPlayhead?: () => void;
  public actionSetMarkerEndToPlayhead?: () => void;
  public actionSetPlayheadToMarkerStart?: () => void;
  public actionSetPlayheadToMarkerEnd?: () => void;
  public actionRewind3SecondsAndPlayToCurrent?: () => void;
  public actionPlay3SecondsAndRewindToCurrent?: () => void;
  public actionLoopActiveMarker?: () => void;

  public getKeyboardShortcutsHelpMenuGroup(): HelpMenuGroup {
    let keyCombination = (...keys: string[]) => {
      return keys.join(" + ");
    };

    let shiftKey = "shift".toUpperCase();
    const platform = UserAgentUtil.platform;
    let metaKey =
      platform === "windows" ? "win" : platform === "linux" ? "super" : "cmd";

    let helpMenuItems: HelpMenuItem[] = [
      {
        description: "Mark In / Out",
        name: keyCombination("m"),
      },

      {
        description: "Split Active Marker",
        name: keyCombination("."),
      },

      {
        description: "Delete Active Marker",
        name: keyCombination("n"),
      },

      {
        description: "Toggle Previous Marker",
        name: keyCombination("/"),
      },

      {
        description: "Toggle Next Marker",
        name: keyCombination(shiftKey, "/"),
      },

      {
        description: "Set Start of Active Marker to Playhead Position",
        name: keyCombination("i"),
      },

      {
        description: "Set End of Active Marker to Playhead Position",
        name: keyCombination("o"),
      },

      {
        description: "Set Playhead to Start of Active Marker",
        name: keyCombination("["),
      },

      {
        description: "Set Playhead to End of Active Marker",
        name: keyCombination("]"),
      },

      {
        description: "Rewind 3 Seconds and Play to Current Playhead",
        name: keyCombination(metaKey, "Arrow Left"),
      },

      {
        description: "Play 3 Seconds and Rewind to Current Playhead",
        name: keyCombination(metaKey, "Arrow Right"),
      },

      {
        description: "Loop on Active Marker",
        name: keyCombination("p"),
      },
    ];

    return {
      name: "Segmentation function shortcuts",
      items: helpMenuItems,
    };
  }
  public handleKeyboardEvent(
    event: KeyboardEvent,
    omakasePlayer: OmakasePlayer
  ): boolean {
    const targetElement = event.target as HTMLElement;
    const formInputs = ["INPUT", "TEXTAREA", "OMAKASE-MARKER-LIST"];
    if (formInputs.includes(targetElement.tagName.toUpperCase())) {
      return false;
    }

    // Marker In / Out
    if (
      event.code === "KeyM" &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      this.actionMarkerInOut && this.actionMarkerInOut();
      return true;
    }

    // Split Marker
    if (
      event.code === "Period" &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      this.actionMarkerSplit && this.actionMarkerSplit();
      return true;
    }

    //remove marker
    if (
      event.code === "KeyN" &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      this.actionMarkerDelete && this.actionMarkerDelete();
      return true;
    }

    // toggle previous / next marker
    if (event.code === "Slash" && !event.ctrlKey && !event.metaKey) {
      if (event.shiftKey) {
        this.actionNextMarkerToggle && this.actionNextMarkerToggle();
      } else {
        this.actionPreviousMarkerToggle && this.actionPreviousMarkerToggle();
      }

      return true;
    }

    // set start of marker to playhead
    if (
      event.code === "KeyI" &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      this.actionSetMarkerStartToPlayhead &&
        this.actionSetMarkerStartToPlayhead();
      return true;
    }

    // set end of marker to playhead
    if (
      event.code === "KeyO" &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      this.actionSetMarkerEndToPlayhead && this.actionSetMarkerEndToPlayhead();
      return true;
    }

    // set playhead to marker start
    if (
      event.code === "BracketLeft" &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      this.actionSetPlayheadToMarkerStart &&
        this.actionSetPlayheadToMarkerStart();
      return true;
    }

    //set playhead to marker end
    if (
      event.code === "BracketRight" &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      this.actionSetPlayheadToMarkerEnd && this.actionSetPlayheadToMarkerEnd();
      return true;
    }

    //rewind 3 seconds and play to current
    if (
      event.code === "ArrowLeft" &&
      !event.shiftKey &&
      !event.ctrlKey &&
      event.metaKey
    ) {
      this.actionRewind3SecondsAndPlayToCurrent &&
        this.actionRewind3SecondsAndPlayToCurrent();
      return true;
    }

    if (
      event.code === "ArrowRight" &&
      !event.shiftKey &&
      !event.ctrlKey &&
      event.metaKey
    ) {
      this.actionPlay3SecondsAndRewindToCurrent &&
        this.actionPlay3SecondsAndRewindToCurrent();
      return true;
    }

    if (
      event.code === "KeyP" &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      this.actionLoopActiveMarker && this.actionLoopActiveMarker();
      return true;
    }

    return false;
  }
}
