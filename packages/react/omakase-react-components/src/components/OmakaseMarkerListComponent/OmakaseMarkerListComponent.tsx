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

import { MarkerListApi, OmakasePlayer } from "@byomakase/omakase-player";

import { MarkerListConfig } from "@byomakase/omakase-player/dist/marker-list/marker-list";
import React, { useEffect } from "react";

type OmakaseMarkerListComponentProps = {
  omakasePlayer: OmakasePlayer;
  config: MarkerListConfig;
  onCreateMarkerListCallback?: (markerListApi: MarkerListApi) => void;
};

const OmakaseMarkerListComponent = React.memo(
  ({
    omakasePlayer,
    config,
    onCreateMarkerListCallback,
  }: OmakaseMarkerListComponentProps) => {
    useEffect(() => {
      const subscription = omakasePlayer.createMarkerList(config).subscribe({
        next: (markerListApi: MarkerListApi) => {
          onCreateMarkerListCallback?.(markerListApi);
        },
      });

      return () => {
        subscription.unsubscribe(); // Unsubscribes on unmount
      };
    }, [config.source]); // Dependencies added

    return <div id={config.markerListHTMLElementId}></div>;
  }
);

export default OmakaseMarkerListComponent;
