import { AudioFlow, Flow, FlowSegment, VideoFlow } from "../../../types";
import { StringUtil } from "../../../util/string-util";
import { TimeRangeUtil } from "../../../util/time-range-util";
import {
  M3U8Segment,
  M3U8StreamInfo,
} from "../../../../../../plugins/virtual-manifest/src";

import { exportSegmentsToManifest } from "../../../../../../plugins/virtual-manifest/src/manifest-export";

type M3U8ManifestMetadata = {
  playlistType: "VOD" | "EVENT";
  programDateTime: string;
  independentSegments: boolean;
  targetDuration: number;
  version: number;
};

type M3U8MasterManifestMetadata = {
  version: number;
  independentSegments: boolean;
};

type M3U8MediaInfo = {
  type: "AUDIO" | "VIDEO" | "SUBTITLES" | "CLOSED-CAPTIONS";
  groupId?: string; // if not present defaults to lowercased type
  name?: string; // if not present defaults to ''
  isDefault: boolean;
  autoSelect: boolean;
  channels: string | null;
};

type BaseSegmentsWithMetadata = {
  segments: M3U8Segment[];
  metadata: Partial<M3U8ManifestMetadata>;
};

type AtLeastOneM3U8Info =
  | { streamInfo: M3U8StreamInfo; mediaInfo?: M3U8MediaInfo }
  | { streamInfo?: M3U8StreamInfo; mediaInfo: M3U8MediaInfo };

// if mediaInfo is present, the segments will be treated as media even though stream info is present
// stream info will be used if no streams are present
type SegmentsWithMetadata = BaseSegmentsWithMetadata & AtLeastOneM3U8Info;

export function removeGapsInSegments(segments?: FlowSegment[]) {
  if (segments === undefined) {
    return segments;
  }
  return segments.flatMap((segment, index) => {
    if (segments.length - 1 === index) {
      return [segment];
    }

    const nextSegment = segments.at(index + 1)!;

    const currentEnd = TimeRangeUtil.timeMomentToSeconds(
      TimeRangeUtil.parseTimeRange(segment.timerange).end!
    );
    const nextStart = TimeRangeUtil.timeMomentToSeconds(
      TimeRangeUtil.parseTimeRange(nextSegment.timerange).start!
    );

    if (Math.abs(currentEnd - nextStart) < 0.001) {
      return [segment];
    }

    const gapSegmentTimerange = TimeRangeUtil.toTimeRange(
      TimeRangeUtil.secondsToTimeMoment(currentEnd),
      TimeRangeUtil.secondsToTimeMoment(nextStart),
      true,
      false
    );

    return [
      segment,
      {
        timerange: TimeRangeUtil.formatTimeRangeExpr(gapSegmentTimerange),
        ts_offset: segment.ts_offset,
        get_urls: segment.get_urls?.map(
          () => "http://byomakase.org/non-playable-gap"
        ),
        object_id: "non-playable-gap",
      } as FlowSegment,
    ];
  });
}

export function gatherAndExportToManifest(
  flow: Flow,
  flowSegments?: FlowSegment[],
  childFlows?: Flow[],
  childFlowsSegments?: Map<string, FlowSegment[]>
): string {
  const sources: SegmentsWithMetadata[] = [];

  const processFlow = (flow: Flow, segments?: FlowSegment[]): void => {
    if (
      flow.format !== "urn:x-nmos:format:video" &&
      flow.format !== "urn:x-nmos:format:audio"
    ) {
      return;
    }

    const m3u8Segments: M3U8Segment[] =
      removeGapsInSegments(segments)?.map((seg) => {
        const duration = TimeRangeUtil.timerangeExprDuration(seg.timerange);
        return new M3U8Segment(
          duration,
          seg.get_urls?.at(-1)?.url ?? "http://byomakase.org/non-playable-gap"
        );
      }) ?? [];

    const targetDuration = Math.max(
      ...m3u8Segments.map((segment) => segment.duration),
      1
    );
    const metadata = {
      playlistType: "VOD" as "VOD",
      targetDuration: Math.ceil(targetDuration),
      version: 3,
      independentSegments: true,
    };

    if (flow.format === "urn:x-nmos:format:video") {
      const videoFlow = flow as VideoFlow;
      const ep = videoFlow.essence_parameters;
      const resolution = {
        width: ep.frame_width,
        height: ep.frame_height,
      };
      const frameRate = ep.frame_rate
        ? ep.frame_rate.denominator
          ? ep.frame_rate.numerator / ep.frame_rate.denominator
          : ep.frame_rate.numerator
        : null;

      const info = new M3U8StreamInfo(
        flow.avg_bit_rate ?? 0,
        flow.avg_bit_rate ?? 0,
        resolution,
        frameRate,
        "" // dummy, will be replaced by URI in exportSegmentsToManifest
      );

      sources.push({ segments: m3u8Segments, metadata, streamInfo: info });
    } else if (flow.format === "urn:x-nmos:format:audio") {
      const audioFlow = flow as AudioFlow;
      const ep = audioFlow.essence_parameters;

      const mediaInfo: M3U8MediaInfo = {
        type: "AUDIO",
        groupId: "audio",
        name: StringUtil.isNullUndefinedOrWhitespace(flow.description)
          ? ""
          : flow.description!,
        isDefault: true,
        autoSelect: true,
        channels: ep.channels.toString(),
      };

      const streamInfo: M3U8StreamInfo = {
        bandwidth: flow.avg_bit_rate ?? 0,
        averageBandwidth: flow.avg_bit_rate ?? 0,
        resolution: null,
        frameRate: null,
        uri: "", // dummy
      };

      sources.push({ segments: m3u8Segments, metadata, mediaInfo, streamInfo });
    }
  };

  if (flow.format === "urn:x-nmos:format:multi") {
    childFlows?.forEach((cf) => {
      const segments = childFlowsSegments?.get(cf.id);
      processFlow(cf, segments);
    });
  } else {
    processFlow(flow, flowSegments);
  }

  const masterManifestMetadata = {
    version: 3,
    independentSegments: true,
  };

  return exportSegmentsToManifest(sources, masterManifestMetadata);
}
