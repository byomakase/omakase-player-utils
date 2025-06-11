import React, { useEffect } from "react";
import {
  OmakasePlayer,
  TimelineApi,
  TimelineConfig,
  ConfigWithOptionalStyle,
} from "@byomakase/omakase-player";

import { combineLatest, filter } from "rxjs";
import { OmakasePlayerTimelineHotKeyHandler } from "./OmakasePlayerTimelineHotKeyHandler";

interface OmakasePlayerTimelineComponentProps {
  omakasePlayer: OmakasePlayer;
  onTimelineCreatedCallback: (timeline: TimelineApi) => void;
  timelineConfig: Partial<ConfigWithOptionalStyle<TimelineConfig>>;
  enableHotKeys?: boolean;
}

const OmakasePlayerTimelineComponent = React.memo(
  ({
    omakasePlayer,
    onTimelineCreatedCallback,
    timelineConfig,
    enableHotKeys,
  }: OmakasePlayerTimelineComponentProps) => {
    useEffect(() => {
      if (timelineConfig.timelineHTMLElementId === undefined) {
        timelineConfig.timelineHTMLElementId = "omakase-timeline";
      }
      omakasePlayer.createTimeline(timelineConfig).subscribe({
        next: (timeline) => {
          combineLatest([
            omakasePlayer.timeline!.onReady$,
            omakasePlayer.video.onVideoLoaded$.pipe(filter((p) => !!p)),
          ]).subscribe({
            next: () => onTimelineCreatedCallback(timeline),
          });
        },
      });

      if (enableHotKeys === undefined || enableHotKeys) {
        const handler = new OmakasePlayerTimelineHotKeyHandler();

        handler.actionToggleCti = () =>
          omakasePlayer.timeline?.toggleTimecodeEdit();
        handler.actionResetZoom = () =>
          omakasePlayer.timeline?.zoomToEased(100);
        handler.actionZoomIn = () => omakasePlayer.timeline?.zoomInEased();
        handler.actionZoomOut = () => omakasePlayer.timeline?.zoomOutEased();

        const toggleNeighbourAudioTrack = (previous: boolean) => {
          const tracks = omakasePlayer.audio.getAudioTracks();
          const currentTrack = omakasePlayer.audio.getActiveAudioTrack();
          const currentTrackIndex = tracks.findIndex(
            (track) => track.id === currentTrack?.id
          );

          const nextTrackIndex = currentTrackIndex + (previous ? -1 : 1);

          if (nextTrackIndex >= 0 && nextTrackIndex < tracks.length) {
            omakasePlayer.audio.setActiveAudioTrack(
              tracks.at(nextTrackIndex)!.id
            );
          }
        };

        handler.actionTogglePreviousAudioTrack = () =>
          toggleNeighbourAudioTrack(true);
        handler.actionToggleNextAudioTrack = () =>
          toggleNeighbourAudioTrack(false);

        const listener = (event: globalThis.KeyboardEvent) => {
          if (handler.handleKeyboardEvent(event)) {
            event.preventDefault();
            event.stopPropagation();
          }
        };

        window.addEventListener("keydown", listener);
        omakasePlayer.video.appendHelpMenuGroup(
          handler.getKeyboardShortcutsHelpMenuGroup()
        );

        return () => {
          window.removeEventListener("keydown", listener);
        };
      }
    }, [omakasePlayer]);

    return <div id={timelineConfig.timelineHTMLElementId}></div>;
  }
);

export default OmakasePlayerTimelineComponent;
