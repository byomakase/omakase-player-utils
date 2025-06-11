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
import { Flow, FlowSegment } from "../../types/tams";
import React, { useMemo } from "react";
import OmakasePlayerComponent from "../OmakasePlayerComponent";
import { gatherAndExportToManifest } from "./virtual-manifest/manifest-export";

type OmakaseTamsPlayerComponentProps = {
  flow: Flow;
  childFlows: Flow[];
  flowSegments: FlowSegment[];
  childFlowsSegments: Map<string, FlowSegment[]>;
  videoLoadOptions?: VideoLoadOptions;
  onVideoLoadedCallback?: (omakasePlayer: OmakasePlayer, video: Video) => void;
  config: Partial<OmakasePlayerConfig>;
  timerange: string;
  enableHotkey?: boolean;
};

const OmakaseTamsPlayerComponent = React.memo(
  function OmakaseTamsPlayerComponent({
    flow,
    childFlows,
    flowSegments,
    childFlowsSegments,
    videoLoadOptions,
    onVideoLoadedCallback,
    config,
    timerange,
    enableHotkey,
  }: OmakaseTamsPlayerComponentProps) {
    const manifest = useMemo(() => {
      return gatherAndExportToManifest(
        flow,
        flowSegments,
        childFlows,
        childFlowsSegments
      );
      // return exportToManifest(
      //   flow,
      //   flowSegments,
      //   childFlows,
      //   childFlowsSegments
      // );
    }, [flow, flowSegments, childFlows, childFlowsSegments, timerange]);

    return (
      <OmakasePlayerComponent
        videoUrl={manifest}
        videoLoadOptions={videoLoadOptions}
        onVideoLoadedCallback={onVideoLoadedCallback}
        config={config}
        enableHotkeys={enableHotkey}
      />
    );
  }
);

export default OmakaseTamsPlayerComponent;
