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

import React, { useEffect, useRef, useState } from "react";
import { LeftDoubleBracketIcon } from "../../icons";
import { RightDoubleBracketIcon } from "../../icons/RightDoubleBracketIcon";
import { LeftBracketIcon } from "../../icons/LeftBracketIcon";
import { RightBracketIcon } from "../../icons/RightBracketIcon";
import { LeftMarkerIcon } from "../../icons/LeftMarkerIcon";
import { SplitMarkerIcon } from "../../icons/SplitMarkerIcon";
import { DeleteMarkerIcon } from "../../icons/DeleteMarkerIcon";
import { RefreshIcon } from "../../icons/RefreshIcon";
import { Back3Icon } from "../../icons/Back3Icon";
import { Forward3Icon } from "../../icons/Forward3Icon";
import { OmakaseButton } from "./OmakaseButton";
import "./OmakasePlayerTimelineControlsToolbar.css";
import {
  Marker,
  MarkerLane,
  OmakasePlayer,
  PeriodMarker,
  PeriodObservation,
  MarkerListApi,
  VideoTimeChangeEvent,
  MarkerUpdateEvent,
  TimelineLaneStyle,
  PeriodMarkerStyle,
  TextLabelStyle,
  VideoSeekingEvent,
} from "@byomakase/omakase-player";
import { first, Subject, takeUntil } from "rxjs";

import { RightMarkerIcon } from "../../icons/RightMarkerIcon";
import { PlusIcon } from "../../icons/PlusIcon";
import { completeSub } from "../../util/rxjs-util";
import { OmakasePlayerTimelineControlsToolbarHotKeyHandler } from "./OmakasePlayerTimelineControlsToolbarHotKeyHandler";

type OmakasePlayerTimelineControlsToolbarProps = {
  selectedMarker: Marker | undefined;
  omakasePlayer: OmakasePlayer;
  markerListApi?: MarkerListApi;
  segmentationLanes: MarkerLane[];
  source: MarkerLane | undefined;
  enableHotKeys?: boolean;
  constants: OmakasePlayerTimelineControlsToolbarConstants;
  setSource: React.Dispatch<React.SetStateAction<MarkerLane | undefined>>;
  setSegmentationLanes: React.Dispatch<React.SetStateAction<MarkerLane[]>>;
  setSelectedMarker: React.Dispatch<React.SetStateAction<Marker | undefined>>;
  onMarkerClickCallback: (marker: Marker | undefined) => void;
};

export type OmakasePlayerTimelineControlsToolbarConstants = {
  HIGHLIGHTED_PERIOD_MARKER_STYLE: Partial<PeriodMarkerStyle> & {
    color: string;
  };
  PERIOD_MARKER_STYLE: Partial<PeriodMarkerStyle> & { color: string };
  TIMELINE_LANE_STYLE: Partial<TimelineLaneStyle>;
  MARKER_LANE_TEXT_LABEL_STYLE: Partial<TextLabelStyle>;
};

type MarkerRecoloring = {
  marker: Marker;
  color: string;
};

const checkMarkerOverlap = (
  lane: MarkerLane,
  checkedMarker: PeriodMarker,
  proposedEnd?: number
): boolean => {
  return lane.getMarkers().reduce((overlaps, marker) => {
    if (checkedMarker.id === marker.id) {
      return overlaps;
    }
    if (
      marker instanceof PeriodMarker &&
      marker.timeObservation.start != undefined &&
      marker.timeObservation.end != undefined
    ) {
      const timeObservation = checkedMarker.timeObservation;
      const markerStart = marker.timeObservation.start!;
      const markerEnd = marker.timeObservation.end!;
      const newStart = timeObservation.start;
      const newEnd = proposedEnd ?? timeObservation.end;

      if (newStart != undefined && newEnd != undefined) {
        // Standard overlap check
        return overlaps || (newStart <= markerEnd && newEnd >= markerStart);
      }
    }
    return overlaps;
  }, false);
};

function checkSplitMarkerDisabled(
  selectedMarker: Marker | undefined,
  time: number,
  omakasePlayer: OmakasePlayer
) {
  if (!selectedMarker || !(selectedMarker instanceof PeriodMarker)) {
    return true;
  }

  const start = selectedMarker.timeObservation.start;
  const end = selectedMarker.timeObservation.end;

  if (start == undefined || end == undefined) {
    return true;
  }

  const endFrame = omakasePlayer.video.calculateTimeToFrame(end);
  const startFrame = omakasePlayer.video.calculateTimeToFrame(start);
  const currentFrame = omakasePlayer.video.getCurrentFrame();

  if (
    time < start ||
    endFrame - currentFrame < 2 ||
    currentFrame - startFrame < 1
  ) {
    return true;
  }

  return false;
}

function isPeriodMarkerComplete(periodMarker: PeriodMarker) {
  if (
    periodMarker.timeObservation.start == undefined ||
    periodMarker.timeObservation.end == undefined
  ) {
    return false;
  }
  return true;
}

const OmakasePlayerTimelineControlsToolbar = ({
  selectedMarker,
  omakasePlayer,
  markerListApi,
  enableHotKeys,
  segmentationLanes,
  setSegmentationLanes,
  setSelectedMarker,
  onMarkerClickCallback,
  setSource,
  source,
  constants,
}: OmakasePlayerTimelineControlsToolbarProps) => {
  const onTimeChangeBreaker$Ref = useRef<Subject<void> | undefined>(undefined);
  const onEndedBreaker$Ref = useRef<Subject<void> | undefined>(undefined);
  const destroyed$ = new Subject<void>();
  const appendedHelpMenuRef = useRef(false);

  const checkTimeInAnotherMarker = (
    lane: MarkerLane,
    chosenTime?: number,
    selectedMarker?: Marker
  ) => {
    const time = chosenTime ?? omakasePlayer.video.getCurrentTime();

    return lane.getMarkers().reduce((found, marker) => {
      if (
        marker instanceof PeriodMarker &&
        marker.timeObservation.start !== undefined &&
        marker.timeObservation.end !== undefined &&
        marker.id !== selectedMarker?.id
      ) {
        return (
          found ||
          (time >= marker.timeObservation.start! &&
            time <= marker.timeObservation.end!)
        );
      }
      return found;
    }, false);
  };

  const checkCloseNewMarkerDisabled = (chosenTime?: number) => {
    if (newMarker === undefined) {
      return true;
    }

    const start = newMarker.timeObservation.start;
    const time = chosenTime ?? omakasePlayer.video.getCurrentTime();

    if (
      start == undefined ||
      start >= time ||
      checkMarkerOverlap(source!, newMarker, time)
    ) {
      return true;
    }
    return false;
  };

  const checkOpenNewMarkerDisabled = (chosenTime?: number) => {
    if (newMarker !== undefined || source === undefined) {
      return true;
    }

    return checkTimeInAnotherMarker(source, chosenTime, newMarker);
  };

  const [markerRecoloring, setMarkerRecoloring] = useState<
    MarkerRecoloring | undefined
  >(undefined);

  const [splitMarkerDisabled, setSplitMarkerDisabled] = useState(
    checkSplitMarkerDisabled(
      selectedMarker,
      omakasePlayer.video.getCurrentTime(),
      omakasePlayer
    )
  );

  const [newMarker, setNewMarker] = useState<PeriodMarker | undefined>(
    undefined
  );

  const [closeNewMarkerDisabled, setCloseNewMarkerDisabled] = useState(
    checkCloseNewMarkerDisabled()
  );

  const [openNewMarkerDisabled, setOpenNewMarkerDisabled] = useState(
    checkOpenNewMarkerDisabled()
  );

  const checkMarkerStartToPlayheadDisabled = (
    selectedMarker: Marker | undefined
  ) => {
    if (
      selectedMarker === undefined ||
      source === undefined ||
      !(selectedMarker instanceof PeriodMarker)
    ) {
      return true;
    }
    const isMarkerOverlapped = checkMarkerOverlap(
      source,
      selectedMarker,
      omakasePlayer.video.getCurrentTime()
    );

    if (isMarkerOverlapped) {
      return isMarkerOverlapped;
    }

    if (selectedMarker instanceof PeriodMarker) {
      const end = selectedMarker.timeObservation.end;
      if (end != undefined && omakasePlayer.video.getCurrentTime() >= end) {
        return true;
      }
    }

    return false;
  };

  const checkMarkerEndToPlayheadDisabled = (
    selectedMarker: Marker | undefined
  ) => {
    if (
      selectedMarker === undefined ||
      source === undefined ||
      !(selectedMarker instanceof PeriodMarker)
    ) {
      return true;
    }

    const isMarkerOverlapped = checkMarkerOverlap(
      source,
      selectedMarker,
      omakasePlayer.video.getCurrentTime()
    );

    if (isMarkerOverlapped) {
      return isMarkerOverlapped;
    }

    if (selectedMarker instanceof PeriodMarker) {
      if (selectedMarker.timeObservation.end == undefined) {
        return true;
      }
      const start = selectedMarker.timeObservation.start;
      if (start != undefined && omakasePlayer.video.getCurrentTime() <= start) {
        return true;
      }
    }

    return false;
  };

  const [markerStartToPlayheadDisabled, setMarkerStartToPlayheadDisabled] =
    useState(checkMarkerStartToPlayheadDisabled(selectedMarker));
  const [markerEndToPlayheadDisabled, setMarkerEndToPlayheadDisabled] =
    useState(checkMarkerEndToPlayheadDisabled(selectedMarker));

  useEffect(() => {
    setCloseNewMarkerDisabled(() => checkCloseNewMarkerDisabled());
    setOpenNewMarkerDisabled(() => checkOpenNewMarkerDisabled());
    if (newMarker && newMarker !== selectedMarker) {
      const source = segmentationLanes.find((lane) =>
        lane.getMarker(newMarker.id)
      );
      source?.removeMarker(newMarker.id);

      setNewMarker(undefined);
    }
  }, [selectedMarker, newMarker, segmentationLanes, setNewMarker]);

  // stop subscriptions on unmount
  useEffect(() => {
    return () => completeSub(destroyed$);
  }, []);

  useEffect(() => {
    setMarkerStartToPlayheadDisabled(
      checkMarkerStartToPlayheadDisabled(selectedMarker)
    );
    setMarkerEndToPlayheadDisabled(
      checkMarkerEndToPlayheadDisabled(selectedMarker)
    );
    if (selectedMarker) {
      // only subscribe if marker is present
      const newSplitMarkerDisabled = checkSplitMarkerDisabled(
        selectedMarker,
        omakasePlayer.video.getCurrentTime(),
        omakasePlayer
      );
      setSplitMarkerDisabled(newSplitMarkerDisabled);

      const subscription = omakasePlayer.video.onVideoTimeChange$
        .pipe(takeUntil(destroyed$))
        .subscribe({
          next: (videoTimeChangeEvent: VideoTimeChangeEvent) => {
            setSplitMarkerDisabled((prevSplitMarkerDisabled) =>
              checkSplitMarkerDisabled(
                selectedMarker,
                videoTimeChangeEvent.currentTime,
                omakasePlayer
              )
            );

            setMarkerStartToPlayheadDisabled(() =>
              checkMarkerStartToPlayheadDisabled(selectedMarker)
            );
            setMarkerEndToPlayheadDisabled(() =>
              checkMarkerEndToPlayheadDisabled(selectedMarker)
            );
          },
        });

      return () => subscription.unsubscribe();
    }
  }, [selectedMarker]);

  useEffect(() => {
    omakasePlayer.video.onSeeking$.pipe(takeUntil(destroyed$)).subscribe({
      next: (videoSeekingEvent: VideoSeekingEvent) => {
        setCloseNewMarkerDisabled(() =>
          checkCloseNewMarkerDisabled(videoSeekingEvent.toTime)
        );
        setOpenNewMarkerDisabled(() =>
          checkOpenNewMarkerDisabled(videoSeekingEvent.toTime)
        );
      },
    });
    const subscription = omakasePlayer.video.onVideoTimeChange$
      .pipe(takeUntil(destroyed$))
      .subscribe({
        next: (videoTimeChangeEvent: VideoTimeChangeEvent) => {
          setCloseNewMarkerDisabled(() => checkCloseNewMarkerDisabled());
          setOpenNewMarkerDisabled(() => checkOpenNewMarkerDisabled());
        },
      });

    return () => subscription.unsubscribe();
  }, [newMarker, source]);

  useEffect(() => {
    const subscriptions = segmentationLanes.map((segmentationLane) => {
      return segmentationLane.onMarkerUpdate$
        .pipe(takeUntil(destroyed$))
        .subscribe({
          next: (markerUpdate: MarkerUpdateEvent) => {
            if (selectedMarker?.id === markerUpdate.marker.id) {
              setSplitMarkerDisabled((prevSplitMarkerDisabled) =>
                checkSplitMarkerDisabled(
                  selectedMarker,
                  omakasePlayer.video.getCurrentTime(),
                  omakasePlayer
                )
              );
              setMarkerStartToPlayheadDisabled(() =>
                checkMarkerStartToPlayheadDisabled(selectedMarker)
              );
              setMarkerEndToPlayheadDisabled(() =>
                checkMarkerEndToPlayheadDisabled(selectedMarker)
              );
            }
          },
        });
    });

    return () =>
      subscriptions.forEach((subscription) => subscription.unsubscribe());
  }, [segmentationLanes, selectedMarker]);

  useEffect(() => {
    if (markerRecoloring) {
      markerRecoloring.marker.style = {
        ...markerRecoloring.marker.style,
        color: markerRecoloring.color,
      };

      markerRecoloring.marker.timeObservation = {
        ...markerRecoloring.marker.timeObservation,
      };

      setMarkerRecoloring(undefined);
    }
  }, [selectedMarker]);

  useEffect(() => {
    if (source) {
      setCloseNewMarkerDisabled(() => checkCloseNewMarkerDisabled());
      setOpenNewMarkerDisabled(() => checkOpenNewMarkerDisabled());
      const subscription = source.onMarkerDelete$
        .pipe(takeUntil(destroyed$))
        .subscribe({
          next: (markerDeletEvent) => {
            const marker = markerDeletEvent.marker;
            setMarkerRecoloring((prevMarkerRecoloring) => {
              if (prevMarkerRecoloring?.marker.id === marker.id) {
                return undefined;
              }
              return prevMarkerRecoloring;
            });

            setSelectedMarker((prevSelectedMarker) => {
              if (prevSelectedMarker?.id === marker.id) {
                return undefined;
              }
              return prevSelectedMarker;
            });

            setNewMarker((prevNewMarker) => {
              if (prevNewMarker?.id === marker.id) {
                return undefined;
              }
              return prevNewMarker;
            });

            setCloseNewMarkerDisabled(() => checkCloseNewMarkerDisabled());
            setOpenNewMarkerDisabled(() => checkOpenNewMarkerDisabled());
          },
        });

      const updateSubscription = source.onMarkerUpdate$
        .pipe(takeUntil(destroyed$))
        .subscribe({
          next: () => {
            setCloseNewMarkerDisabled(() => checkCloseNewMarkerDisabled());
            setOpenNewMarkerDisabled(() => checkOpenNewMarkerDisabled());
          },
        });

      return () => {
        subscription.unsubscribe();
        updateSubscription.unsubscribe();
      };
    }
  }, [source]);

  const playheadToStart = (
    omakasePlayer: OmakasePlayer,
    marker: Marker | undefined
  ) => {
    if (marker === undefined) {
      return;
    }
    marker as PeriodMarker;
    const periodObservation = marker.timeObservation as PeriodObservation;
    omakasePlayer.video!.seekToTime(periodObservation.start!);
  };

  const playheadToEnd = (
    omakasePlayer: OmakasePlayer,
    marker: Marker | undefined
  ) => {
    if (marker === undefined) {
      return;
    }
    marker as PeriodMarker;
    const periodObservation = marker.timeObservation as PeriodObservation;
    omakasePlayer.video!.seekToTime(periodObservation.end!);
  };

  const markerStartToPlayhead = (
    omakasePlayer: OmakasePlayer,
    marker: Marker
  ) => {
    if (!(marker instanceof PeriodMarker)) {
      return;
    }

    if (marker.timeObservation.start !== undefined) {
      marker.timeObservation = {
        ...marker.timeObservation,
        start: omakasePlayer.video.getCurrentTime(),
      };
    }
  };

  const markerEndToPlayhead = (
    omakasePlayer: OmakasePlayer,
    marker: Marker
  ) => {
    if (!(marker instanceof PeriodMarker)) {
      return;
    }

    if (marker.timeObservation.end !== undefined) {
      marker.timeObservation = {
        ...marker.timeObservation,
        end: omakasePlayer.video.getCurrentTime(),
      };
    }
  };

  const playLastNseconds = (omakasePlayer: OmakasePlayer, nSeconds: number) => {
    if (onTimeChangeBreaker$Ref.current) {
      completeSub(onTimeChangeBreaker$Ref.current);
    }
    onTimeChangeBreaker$Ref.current = new Subject();

    omakasePlayer.video.pause();

    const stopFrame = omakasePlayer.video.getCurrentFrame();
    const frameRate = omakasePlayer.video.getFrameRate();
    const desiredStartFrame = stopFrame - nSeconds * frameRate;
    const startFrame = desiredStartFrame >= 0 ? desiredStartFrame : 0;

    omakasePlayer.video
      .seekToFrame(startFrame)
      .pipe(first())
      .subscribe(() => {});

    omakasePlayer.video.play();

    omakasePlayer.video.onVideoTimeChange$
      .pipe(takeUntil(onTimeChangeBreaker$Ref.current), takeUntil(destroyed$))
      .subscribe((event) => {
        if (event.frame >= stopFrame - 1) {
          omakasePlayer.video.pause().subscribe(() => {
            omakasePlayer.video
              .seekToFrame(stopFrame)
              .pipe(first())
              .subscribe(() => {});
          });

          completeSub(onTimeChangeBreaker$Ref.current!);
        }
      });
  };

  const playNextNSeconds = (omakasePlayer: OmakasePlayer, nSeconds: number) => {
    if (onTimeChangeBreaker$Ref.current) {
      completeSub(onTimeChangeBreaker$Ref.current);
    }
    onTimeChangeBreaker$Ref.current = new Subject();

    if (onEndedBreaker$Ref.current) {
      completeSub(onEndedBreaker$Ref.current);
    }
    onEndedBreaker$Ref.current = new Subject();

    const startFrame = omakasePlayer.video.getCurrentFrame();
    const frameRate = omakasePlayer.video.getFrameRate();
    const stopFrame = startFrame + nSeconds * frameRate;

    omakasePlayer.video.play();

    omakasePlayer.video.onVideoTimeChange$
      .pipe(takeUntil(onTimeChangeBreaker$Ref.current), takeUntil(destroyed$))
      .subscribe((event) => {
        if (event.frame >= stopFrame - 1) {
          omakasePlayer.video.pause().subscribe(() => {
            omakasePlayer.video
              .seekToFrame(startFrame)
              .pipe(first())
              .subscribe(() => {});
          });

          completeSub(onTimeChangeBreaker$Ref.current!);
        }
      });

    omakasePlayer.video.onEnded$
      .pipe(takeUntil(onEndedBreaker$Ref.current), takeUntil(destroyed$))
      .subscribe((event) => {
        setTimeout(() => {
          omakasePlayer.video
            .seekToFrame(startFrame)
            .pipe(first())
            .subscribe(() => {});
        }, 1);

        completeSub(onEndedBreaker$Ref.current!);
      });
  };

  const deleteMarker = (marker: Marker) => {
    source!.removeMarker(marker.id);

    if (newMarker?.id === marker.id) {
      setNewMarker(undefined);
    }
  };

  const splitMarker = (
    omakasePlayer: OmakasePlayer,
    selectedMarker: Marker
  ) => {
    if (!(selectedMarker instanceof PeriodMarker)) {
      return;
    }

    const start = selectedMarker.timeObservation.start;
    const end = selectedMarker.timeObservation.end;
    const playheadTime = omakasePlayer.video.getCurrentTime();

    if (start == null || end == null) {
      return;
    }

    const startFirst = start;
    const endFrist = playheadTime;

    const startSecond = endFrist + 1 / omakasePlayer.video.getFrameRate();
    const endSecond = end;

    deleteMarker(selectedMarker);

    const firstMarker = new PeriodMarker({
      style: constants.PERIOD_MARKER_STYLE,
      timeObservation: {
        start: startFirst,
        end: endFrist,
      },
      editable: true,
    });

    firstMarker.onClick$.subscribe({
      next: () => onMarkerClickCallback(firstMarker),
    });

    const secondMarker = new PeriodMarker({
      style: constants.HIGHLIGHTED_PERIOD_MARKER_STYLE,
      timeObservation: {
        start: startSecond,
        end: endSecond,
      },
      editable: true,
    });

    secondMarker.onClick$.subscribe({
      next: () => onMarkerClickCallback(secondMarker),
    });

    source!.addMarker(firstMarker);
    source!.addMarker(secondMarker);

    onMarkerClickCallback(secondMarker);

    setTimeout(() => {
      // set recoloring after render cycle, else it will recolor right away as setSelectedMarker is also called
      setMarkerRecoloring({
        marker: secondMarker,
        color: constants.PERIOD_MARKER_STYLE.color,
      });
    }, 0);
  };

  const openNewMarker = () => {
    const currentTime = omakasePlayer.video.getCurrentTime();

    const newMarker = new PeriodMarker({
      timeObservation: {
        start: currentTime,
      },
      style: constants.PERIOD_MARKER_STYLE,
      editable: true,
    });

    newMarker.onClick$.subscribe({
      next: () => onMarkerClickCallback(newMarker),
    });

    source!.addMarker(newMarker);

    setNewMarker(newMarker);
    setCloseNewMarkerDisabled(checkCloseNewMarkerDisabled());
    onMarkerClickCallback(newMarker);
  };

  const closeNewMarker = () => {
    const currentTime = omakasePlayer.video.getCurrentTime();

    newMarker!.timeObservation = {
      ...newMarker!.timeObservation,
      end: currentTime,
    };

    setNewMarker(undefined);
  };

  const loopMarker = (periodMarker: PeriodMarker) => {
    if (onTimeChangeBreaker$Ref.current) {
      completeSub(onTimeChangeBreaker$Ref.current);
    }
    onTimeChangeBreaker$Ref.current = new Subject();

    if (onEndedBreaker$Ref.current) {
      completeSub(onEndedBreaker$Ref.current);
    }
    onEndedBreaker$Ref.current = new Subject();

    const startFrame = omakasePlayer.video.calculateTimeToFrame(
      periodMarker.timeObservation.start!
    );
    const stopFrame = omakasePlayer.video.calculateTimeToFrame(
      periodMarker.timeObservation.end!
    );

    omakasePlayer.video.pause();
    omakasePlayer.video.seekToFrame(startFrame);
    omakasePlayer.video.play();

    omakasePlayer.video.onVideoTimeChange$
      .pipe(takeUntil(onTimeChangeBreaker$Ref.current), takeUntil(destroyed$))
      .subscribe((event) => {
        if (event.frame >= stopFrame - 1) {
          omakasePlayer.video.pause().subscribe(() => {
            omakasePlayer.video
              .seekToFrame(startFrame)
              .pipe(first())
              .subscribe(() => {});
          });

          completeSub(onTimeChangeBreaker$Ref.current!);
        }
      });

    omakasePlayer.video.onEnded$
      .pipe(takeUntil(onEndedBreaker$Ref.current), takeUntil(destroyed$))
      .subscribe((event) => {
        setTimeout(() => {
          omakasePlayer.video
            .seekToFrame(startFrame)
            .pipe(first())
            .subscribe(() => {});
        }, 1);

        completeSub(onEndedBreaker$Ref.current!);
      });
  };

  const addSegmentationLane = () => {
    const lastSegmentationLaneIndex = segmentationLanes.length;

    const newSegmentationLaneId = `Segmentation ${
      segmentationLanes.length + 1
    }`;
    const newSegmentationLane = new MarkerLane({
      style: constants.TIMELINE_LANE_STYLE,
      description: newSegmentationLaneId,
    });

    newSegmentationLane.onMarkerUpdate$.subscribe({
      next: (markerUpdateEvent) => {
        if (
          checkMarkerOverlap(
            newSegmentationLane,
            markerUpdateEvent.marker as PeriodMarker
          )
        ) {
          markerUpdateEvent.marker.timeObservation =
            markerUpdateEvent.oldValue.timeObservation;
        }
      },
    });

    omakasePlayer.timeline!.addTimelineLaneAtIndex(
      newSegmentationLane,
      lastSegmentationLaneIndex + 1
    );

    setSegmentationLanes([...segmentationLanes, newSegmentationLane]);
    onMarkerClickCallback(undefined);
    setSource(newSegmentationLane);
  };

  const toggleNeighbourPeriodMarker = (previous: boolean) => {
    if (!source) {
      return;
    }

    const markersSortedByStartTime = source
      .getMarkers()
      .filter((marker) => marker instanceof PeriodMarker)
      .sort((a, b) => {
        return a.timeObservation.start ?? 0 - (b.timeObservation.start ?? 0);
      });

    if (selectedMarker === undefined) {
      onMarkerClickCallback(markersSortedByStartTime.at(0));
      return;
    }

    const selectedMarkerIndex = markersSortedByStartTime.findIndex(
      (marker) => marker.id === selectedMarker.id
    );
    const neighbourMarkerIndex = selectedMarkerIndex + (previous ? -1 : 1);

    if (
      neighbourMarkerIndex >= 0 &&
      neighbourMarkerIndex < markersSortedByStartTime.length
    ) {
      onMarkerClickCallback(markersSortedByStartTime.at(neighbourMarkerIndex));
    }
  };

  useEffect(() => {
    if (!enableHotKeys) {
      return;
    }
    const hotKeyHandler =
      new OmakasePlayerTimelineControlsToolbarHotKeyHandler();
    hotKeyHandler.actionLoopActiveMarker = () =>
      selectedMarker instanceof PeriodMarker &&
      isPeriodMarkerComplete(selectedMarker) &&
      loopMarker(selectedMarker);

    hotKeyHandler.actionSetPlayheadToMarkerStart = () =>
      selectedMarker && playheadToStart(omakasePlayer, selectedMarker);
    hotKeyHandler.actionSetPlayheadToMarkerEnd = () =>
      selectedMarker &&
      selectedMarker instanceof PeriodMarker &&
      isPeriodMarkerComplete(selectedMarker) &&
      playheadToEnd(omakasePlayer, selectedMarker);

    hotKeyHandler.actionSetMarkerStartToPlayhead = () =>
      !markerStartToPlayheadDisabled &&
      markerStartToPlayhead(omakasePlayer, selectedMarker!);
    hotKeyHandler.actionSetMarkerEndToPlayhead = () =>
      !markerEndToPlayheadDisabled &&
      markerEndToPlayhead(omakasePlayer, selectedMarker!);

    hotKeyHandler.actionMarkerSplit = () =>
      !splitMarkerDisabled && splitMarker(omakasePlayer, selectedMarker!);
    hotKeyHandler.actionMarkerDelete = () =>
      selectedMarker && deleteMarker(selectedMarker);

    hotKeyHandler.actionMarkerInOut = () => {
      if (newMarker === undefined) {
        !openNewMarkerDisabled && openNewMarker();
      } else {
        !closeNewMarkerDisabled && closeNewMarker();
      }
    };

    hotKeyHandler.actionPlay3SecondsAndRewindToCurrent = () =>
      playNextNSeconds(omakasePlayer, 3);
    hotKeyHandler.actionRewind3SecondsAndPlayToCurrent = () =>
      playLastNseconds(omakasePlayer, 3);

    hotKeyHandler.actionNextMarkerToggle = () =>
      toggleNeighbourPeriodMarker(false);
    hotKeyHandler.actionPreviousMarkerToggle = () =>
      toggleNeighbourPeriodMarker(true);

    const listener = (event: globalThis.KeyboardEvent) => {
      const handeled = hotKeyHandler.handleKeyboardEvent(event, omakasePlayer);
      if (handeled) {
        event.stopPropagation();
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", listener);
    if (!appendedHelpMenuRef.current) {
      omakasePlayer.video.appendHelpMenuGroup(
        hotKeyHandler.getKeyboardShortcutsHelpMenuGroup()
      );
      appendedHelpMenuRef.current = true;
    }

    return () => window.removeEventListener("keydown", listener);
  });

  return (
    <div className="control-panel-wrapper">
      <div className="control-panel">
        <OmakaseButton
          Icon={LeftDoubleBracketIcon}
          onClick={() => playheadToStart(omakasePlayer, selectedMarker)}
          disabled={selectedMarker === undefined}
        ></OmakaseButton>
        <OmakaseButton
          Icon={RightDoubleBracketIcon}
          onClick={() => playheadToEnd(omakasePlayer, selectedMarker)}
          disabled={
            selectedMarker === undefined ||
            (selectedMarker instanceof PeriodMarker &&
              !isPeriodMarkerComplete(selectedMarker))
          }
        ></OmakaseButton>

        <OmakaseButton
          Icon={LeftBracketIcon}
          onClick={() => markerStartToPlayhead(omakasePlayer, selectedMarker!)}
          disabled={markerStartToPlayheadDisabled}
        ></OmakaseButton>

        <OmakaseButton
          Icon={RightBracketIcon}
          onClick={() => markerEndToPlayhead(omakasePlayer, selectedMarker!)}
          disabled={markerEndToPlayheadDisabled}
        ></OmakaseButton>

        {newMarker === undefined ? (
          <OmakaseButton
            Icon={LeftMarkerIcon}
            onClick={openNewMarker}
            disabled={openNewMarkerDisabled}
          ></OmakaseButton>
        ) : (
          <OmakaseButton
            Icon={RightMarkerIcon}
            onClick={closeNewMarker}
            disabled={closeNewMarkerDisabled}
          ></OmakaseButton>
        )}

        <OmakaseButton
          Icon={DeleteMarkerIcon}
          onClick={() => deleteMarker(selectedMarker!)}
          disabled={selectedMarker === undefined}
        ></OmakaseButton>

        <OmakaseButton
          Icon={SplitMarkerIcon}
          onClick={() => splitMarker(omakasePlayer, selectedMarker!)}
          disabled={splitMarkerDisabled || selectedMarker === undefined}
        ></OmakaseButton>

        <OmakaseButton
          Icon={RefreshIcon}
          onClick={() => loopMarker(selectedMarker as PeriodMarker)}
          disabled={
            selectedMarker instanceof PeriodMarker &&
            isPeriodMarkerComplete(selectedMarker)
              ? false
              : true
          }
        ></OmakaseButton>

        <OmakaseButton
          Icon={Back3Icon}
          onClick={() => playLastNseconds(omakasePlayer, 3)}
        ></OmakaseButton>

        <OmakaseButton
          Icon={Forward3Icon}
          onClick={() => playNextNSeconds(omakasePlayer, 3)}
        ></OmakaseButton>
      </div>
      <div className="control-panel">
        <div className="segmentation-button-wrapper">
          <OmakaseButton
            Icon={PlusIcon}
            text="NEW SEGMENTATION"
            onClick={() => addSegmentationLane()}
            disabled={segmentationLanes.length >= 3}
          />
        </div>
      </div>
    </div>
  );
};

export default OmakasePlayerTimelineControlsToolbar;
