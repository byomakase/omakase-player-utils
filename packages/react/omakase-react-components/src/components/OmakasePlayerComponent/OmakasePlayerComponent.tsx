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
  OmakasePlayer,
  OmakasePlayerConfig,
  Video,
  VideoLoadOptions,
} from "@byomakase/omakase-player";
import React from "react";
import { useEffect } from "react";
import { OmakasePlayerHotKeyHandler } from "./OmakasePlayerHotKeyHandler";
// import "./OmakasePlayer.css";

type OmakasePlayerComponentProps = {
  videoUrl: string;
  videoLoadOptions?: VideoLoadOptions;
  onVideoLoadedCallback?: (omakasePlayer: OmakasePlayer, video: Video) => void;
  config: Partial<OmakasePlayerConfig>;
  enableHotkeys?: boolean;
};

const OmakasePlayerComponent = React.memo(function OmakasePlayerComponent({
  videoUrl,
  config,
  videoLoadOptions,
  onVideoLoadedCallback,
  enableHotkeys,
}: OmakasePlayerComponentProps) {
  if (config && config?.playerHTMLElementId === undefined) {
    config.playerHTMLElementId = "omakase-player";
  }
  useEffect(() => {
    let omakasePlayer = new OmakasePlayer(config);

    // if (setOmakasePlayer) {
    //   setOmakasePlayer((prev) => prev ?? omakasePlayer);
    // }

    const listener = (event: KeyboardEvent) => {
      const handled = OmakasePlayerHotKeyHandler.handleKeyboardEvent(
        event,
        omakasePlayer
      );
      if (handled) {
        event.stopPropagation();
        event.preventDefault();
      }
    };

    if (enableHotkeys === undefined || enableHotkeys) {
      document.querySelector("media-controller")?.setAttribute("nohotkeys", "");
      document
        .querySelector("media-controller")
        ?.setAttribute("tabindex", "-1");
      window.addEventListener("keydown", listener);
      omakasePlayer.video.appendHelpMenuGroup(
        OmakasePlayerHotKeyHandler.getKeyboardShortcutsHelpMenuGroup()
      );
    }

    omakasePlayer.loadVideo(videoUrl, videoLoadOptions).subscribe({
      next: (video: Video) => {
        if (onVideoLoadedCallback) {
          onVideoLoadedCallback(omakasePlayer, video);
        }
      },
    });

    return () => {
      if (enableHotkeys === undefined || enableHotkeys) {
        window.removeEventListener("keydown", listener);
      }
    };
  }, [videoUrl]);

  return <div id={config.playerHTMLElementId}></div>;
});

export default OmakasePlayerComponent;
