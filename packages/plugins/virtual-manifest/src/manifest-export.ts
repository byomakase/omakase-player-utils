import { M3U8PlaylistBuilder, M3U8PlaylistWriter } from "./m3u8";
import { M3U8Media, M3U8Segment, M3U8StreamInfo } from "./m3u8.model";

export type M3U8ManifestMetadata = {
  playlistType: "VOD" | "EVENT";
  programDateTime: string;
  independentSegments: boolean;
  targetDuration: number;
  version: number;
};

export type M3U8MasterManifestMetadata = {
  version: number;
  independentSegments: boolean;
};

export type M3U8MediaInfo = {
  type: "AUDIO" | "VIDEO" | "SUBTITLES" | "CLOSED-CAPTIONS";
  groupId?: string; // if not present defaults to lowercased type
  name?: string; // if not present defaults to ''
  isDefault: boolean;
  autoSelect: boolean;
  channels: string | null;
};

export type BaseSegmentsWithMetadata = {
  segments: M3U8Segment[];
  metadata: Partial<M3U8ManifestMetadata>;
};

export type AtLeastOneM3U8Info =
  | { streamInfo: M3U8StreamInfo; mediaInfo?: M3U8MediaInfo }
  | { streamInfo?: M3U8StreamInfo; mediaInfo: M3U8MediaInfo };

// if mediaInfo is present, the segments will be treated as media even though stream info is present
// stream info will be used if no streams are present
export type SegmentsWithMetadata = BaseSegmentsWithMetadata &
  AtLeastOneM3U8Info;

export function exportSegmentsToManifest(
  sources: SegmentsWithMetadata[],
  masterManifestMetadata: M3U8MasterManifestMetadata
): string {
  const hasAnyStream = sources.some(
    (source) => source.streamInfo || source.mediaInfo?.type === "AUDIO"
  );

  if (!hasAnyStream) {
    throw new Error(
      "Can't create an hls manifest without audio or video source"
    );
  }

  const masterBuilder = new M3U8PlaylistBuilder()
    .setVersion(10)
    .setIndependentSegments(masterManifestMetadata.independentSegments);

  const subManifestURIs: string[] = [];
  let hasVideoStream = sources.some(
    ({ streamInfo, mediaInfo }) => streamInfo && !mediaInfo
  );
  let isStreamAdded = false;

  for (let i = 0; i < sources.length; i++) {
    const { segments, metadata, streamInfo, mediaInfo } = sources[i];

    let targetDuration = metadata.targetDuration;

    if (targetDuration === undefined) {
      targetDuration = Math.max(
        ...segments.map((segment) => segment.duration),
        1
      );
    }

    const builder = new M3U8PlaylistBuilder()
      .setVersion(metadata.version ?? 3)
      .setIndependentSegments(metadata.independentSegments ?? true)
      .setTargetDuration(Math.ceil(targetDuration));

    if (metadata.programDateTime) {
      builder.setProgramDateTime(metadata.programDateTime);
    }

    if (metadata.playlistType) {
      builder.setPlaylistType(metadata.playlistType);
    }

    segments.forEach((s) =>
      builder.addSegment(s, s.uri === "http://byomakase.org/non-playable-gap")
    );
    builder.setEndList();

    const subPlaylist = builder.build();
    const subM3U8 = M3U8PlaylistWriter.write(subPlaylist);
    const blob = new Blob([subM3U8], { type: "application/vnd.apple.mpegurl" });
    const uri = URL.createObjectURL(blob);

    if (streamInfo && !mediaInfo) {
      const stream = new M3U8StreamInfo(
        streamInfo.bandwidth,
        streamInfo.averageBandwidth,
        streamInfo.resolution,
        streamInfo.frameRate,
        uri
      );
      masterBuilder.addStreamInfo(stream);
    } else if (mediaInfo) {
      const media = new M3U8Media(
        mediaInfo.type,
        mediaInfo.groupId ?? mediaInfo.type.toLowerCase(),
        mediaInfo.name ?? "",
        mediaInfo.isDefault,
        mediaInfo.autoSelect,
        mediaInfo.channels,
        uri
      );
      masterBuilder.addMedia(media);
      if (!hasVideoStream && mediaInfo.type === "AUDIO" && !isStreamAdded) {
        const stream = new M3U8StreamInfo(
          streamInfo?.bandwidth ?? 0,
          streamInfo?.averageBandwidth ?? 0,
          null,
          null,
          uri
        );
        masterBuilder.addStreamInfo(stream);
        isStreamAdded = true;
      }
    }

    subManifestURIs.push(uri);
  }

  const masterPlaylist = masterBuilder.build();
  const masterM3U8 = M3U8PlaylistWriter.write(masterPlaylist);
  const masterBlob = new Blob([masterM3U8], {
    type: "application/vnd.apple.mpegurl",
  });
  const masterUri = URL.createObjectURL(masterBlob);

  return masterUri;
}
