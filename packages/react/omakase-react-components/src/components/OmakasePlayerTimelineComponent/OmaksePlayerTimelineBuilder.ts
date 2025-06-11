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
  ConfigWithOptionalStyle,
  ImageButton,
  Marker,
  MarkerLane,
  MarkerLaneConfig,
  OmakasePlayer,
  ThumbnailLane,
  ThumbnailLaneConfig,
  TimelineApi,
  TimelineConfig,
  TimelineLaneApi,
  TimelineNode,
} from "@byomakase/omakase-player";
import {
  TimelineLaneComponentConfig,
  TimelineLaneConfigDefaultsExcluded,
} from "@byomakase/omakase-player/dist/timeline/timeline-lane";

type MarkerLaneConstructionData = {
  config: TimelineLaneConfigDefaultsExcluded<MarkerLaneConfig>;
  type: "marker";
};

type ThumbnailLaneConstructionData = {
  config: TimelineLaneConfigDefaultsExcluded<ThumbnailLaneConfig>;
  type: "thumbnail";
};

type LaneConstructionData =
  | MarkerLaneConstructionData
  | ThumbnailLaneConstructionData;

type NodeConstructionData = {
  config: TimelineLaneComponentConfig;
  node: TimelineNode;
};

export class OmakasePlayerTimelineBuilder {
  private _lanes: LaneConstructionData[] = [];
  private _markersLaneMap: Map<string, Marker[]> = new Map();
  private _laneNodenMap: Map<string, NodeConstructionData[]> = new Map();

  constructor(private omakasePlayer: OmakasePlayer) {}

  addMarkerLane(config: TimelineLaneConfigDefaultsExcluded<MarkerLaneConfig>) {
    const constructionData: MarkerLaneConstructionData = {
      config: config,
      type: "marker",
    };
    this._lanes.push(constructionData);
  }

  addMarkers(markerLaneId: string, markers: Marker[]) {
    if (this._markersLaneMap.get(markerLaneId) === undefined) {
      this._markersLaneMap.set(markerLaneId, []);
    }

    this._markersLaneMap.get(markerLaneId)!.push(...markers);
  }

  addTimelineNode(laneId: string, nodeConstructionData: NodeConstructionData) {
    if (!this._laneNodenMap.get(laneId)) {
      this._laneNodenMap.set(laneId, []);
    }

    this._laneNodenMap.get(laneId)!.push(nodeConstructionData);
  }

  addThumbnailLane(
    config: TimelineLaneConfigDefaultsExcluded<ThumbnailLaneConfig>
  ) {
    const constructionData: ThumbnailLaneConstructionData = {
      config: config,
      type: "thumbnail",
    };

    this._lanes.push(constructionData);
  }

  buildAndAttachTimeline(
    timelineConfig: Partial<ConfigWithOptionalStyle<TimelineConfig>>
  ) {
    this.omakasePlayer.createTimeline(timelineConfig).subscribe({
      next: (timelineApi) => {
        this.buildAttachedTimeline(timelineApi);
      },
    });
  }

  buildAttachedTimeline(timeline: TimelineApi) {
    this._lanes.forEach((laneConstructionData) =>
      this._createAndAttachLane(timeline, laneConstructionData)
    );
  }

  private _createAndAttachLane(
    timeline: TimelineApi,
    laneConstructionData: LaneConstructionData
  ) {
    let lane: TimelineLaneApi;
    if (laneConstructionData.type === "marker") {
      lane = new MarkerLane(laneConstructionData.config) as MarkerLane;
      timeline.addTimelineLane(lane);

      const markers = this._markersLaneMap.get(lane.id);
      markers?.forEach((marker) => (lane as MarkerLane).addMarker(marker));
    } else if (laneConstructionData.type === "thumbnail") {
      lane = new ThumbnailLane(laneConstructionData.config);
      timeline.addTimelineLane(lane);
    }

    const buttonConstructionDatas = this._laneNodenMap.get(lane!.id);

    buttonConstructionDatas?.forEach((buttonConstructionData) => {
      lane!.addTimelineNode(buttonConstructionData.config);
    });
  }
}
