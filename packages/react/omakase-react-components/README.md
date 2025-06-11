# Omakase Player Utils - React Components

Omakase Player Utils - React Components is a component library designed to facilitate seamless integration of [Omakase Player](https://player.byomakase.org/) with React.js framework. Omakase player is an open source javascript video player used for building frame accurate video experiences. The components handle basic lifecycle needs, while allowing for full control of Omakase Player with callbacks. Components have been built using Typescript and by extension TSX .

## OmakasePlayerComponent

OmakasePlayerComponent bootstraps Omakase Player. It returns a single div with bootstrapped [Omakase player](https://api.player.byomakase.org/index.html).

```js
return (
  <OmakasePlayerComponent
    videoUrl={manifestUrl}
    videoLoadOptions={videoLoadOptions}
    onVideoLoadedCallback={(omakasePlayer, video) =>
      console.log(omakasePlayer, video)
    }
    config={config}
    enableHotkeys={enableHotkey}
  />
);
```

The following properties are supported:

- `videoUrl`: A string representing the URL of video you want to load
- `videoLoadOptions`: Object representing [options](https://api.player.byomakase.org/interfaces/VideoLoadOptions.html) used for video loading.
- `onVideoLoadedCallback`: Callback called after initial video load. Useful for retrieving OmakasePlayer instance.
- `config`: Object representing the omakase player's [configuration](https://api.player.byomakase.org/interfaces/OmakasePlayerConfig.html). If `playerHTMLElementId` property is not set it will default to `omakase-player`.
- `enableHotkeys`: A boolean used to enable or disable hot keys. Defaults to `true`

OmakasePlayerComponent is wrapped in `React.memo` and it will NOT rerender unless the passed properties are changed. This behavior allows for frequent parent state changes without reinitializing OmakasePlayer.

### Hot keys:

| Description                             | Key Combination     |
| --------------------------------------- | ------------------- |
| Play / Pause                            | Space               |
| Toggle Sound                            | S                   |
| Toggle Text On / Off                    | D                   |
| Toggle Full Screen                      | F                   |
| Increase Volume                         | Shift + \           |
| Reduce Volume                           | \                   |
| One Frame Forward                       | Right Arrow         |
| One Frame Backward                      | Left Arrow          |
| 10 Frames Forward                       | Shift + Right Arrow |
| 10 Frames Backward                      | Shift + Left Arrow  |
| Stop shuttle and pause                  | K                   |
| Decrease Shuttle Forwards               | L                   |
| Increase Shuttle Forwards               | Shift + L           |
| Set playhead to Start of Media and Stop | 1 / Home            |
| Set playhead to End of Media and Stop   | Ctrl + 1 / End      |

## OmakaseTimelineComponent

OmakaseTimelineComponent is used to render timeline for Omakase Player. It renders a single div in which timeline can be created by providing `populateTimelineFn` callback.

```js
{
  omakasePlayer && (
    <OmakasePlayerTimelineComponent
      omakasePlayer={omakasePlayer}
      timelineConfig={TIMELINE_CONFIG}
      onTimelineCreatedCallback={(timeline) =>
        buildTimeline(timeline, omakasePlayer, markers)
      }
    />
  );
}
```

The following properties are supported:

- `omakasePlayer`: A reference to Omakase player instance which uses this timeline
- `onTimelineCreatedCallback`: A callback function accepting [TimelineApi](https://api.player.byomakase.org/interfaces/TimelineApi.html) that can be used to populate timeline. The callback is called after timeline instantiation\
- `timelineConfig`: An object representing timeline [configuration](https://api.player.byomakase.org/interfaces/TimelineConfig.html)
- `enableHotKeys`: A boolean used to enable or disable hot keys. Defaults to true

- `onTimelineCreatedCallback` will be called only on Omakase player reference change, even if other props change.

OmakaseTimelineComponent is also memoized to prevent timeline rerendering on parent rerender.

### Hot keys

| Description                 | Key Combination |
| --------------------------- | --------------- |
| Timeline Zoom In            | =               |
| Timeline Zoom Out           | -               |
| Timeline Zoom level 100%    | 0               |
| Toggle Next Audio Track     | Shift + E       |
| Toggle Previous Audio Track | E               |

## OmakasePlayerTimelineControlsToolbar

OmakasePlayerTimelineControlsToolbar handles various operations you can do on a timeline with the focus on segmentation
by manipulating Markers.

```js
{
  omakasePlayer && source && (
    <OmakasePlayerTimelineControlsToolbar
      selectedMarker={selectedMarker}
      omakasePlayer={omakasePlayer}
      setSegmentationLanes={setSegmentationLanes}
      setSelectedMarker={setSelectedMarker}
      onMarkerClickCallback={onMarkerClickCallback}
      segmentationLanes={segmentationLanes}
      source={source}
      setSource={setSource}
      enableHotKeys={true}
      constants={{
        PERIOD_MARKER_STYLE: PERIOD_MARKER_STYLE,
        HIGHLIGHTED_PERIOD_MARKER_STYLE: HIGHLIGHTED_PERIOD_MARKER_STYLE,
        TIMELINE_LANE_STYLE: MARKER_LANE_STYLE,
      }}
    />
  );
}
```

The following properties are present:

- `selectedMarker`: A reference to the marker that is currently selected
- `omakasePlayer`: A reference to the instance of OmakasePlayer to which markers and lanes are registered
- `segmentationLanes`: A reference to the state holding a list of [MarkerLanes](https://api.player.byomakase.org/classes/MarkerLane.html) used for media segmentation.
- `source`: A reference to one of the segmentation lanes that is currently considered active. ControlsToolbar will only interact with markers in the source.
- `setSegmentationLanes`: A react state setter for segmentation lanes
- `setSource`: A react state setter for source
- `enableHotKeys`: A boolean used to enable hot keys. Defaults to true.
- `constants`: An object containing styles for Omakase timeline elements that ControlsToolbar can create.
- `onMarkerClickCallback`: A function used to set callbacks that trigger when marker created by ControlsToolbar is clicked.

The following controls are present (in order of layout):

| Name                     | Description                                                                   |
| ------------------------ | ----------------------------------------------------------------------------- |
| Playhead to Marker Start | Positions the playhead to the start of selected marker                        |
| Playhead to Marker End   | Positions the playhead to the end of selected marker                          |
| Marker Start to Playhead | Positions the start of selected marker to the playhead                        |
| Marker End to Playhead   | Positions the end of selected marker to the playhead                          |
| Open/Close New Marker    | Opens/closes a new marker with the time of start/end set to playhead          |
| Delete Marker            | Deletes selected marker                                                       |
| Split Marker             | Splits the selected marker in two at the playhead                             |
| Loop Marker              | Play video from the start of selected marker to the end and seek to the start |
| Play Previous 3 seconds  | Play previous 3 seconds and stop at current playhead                          |
| Play Next 3 seconds      | Play next 3 seconds and seek and stop at current playhead                     |
| Add New Segmentation     | Create new segmentation lane                                                  |

### Hot keys

| Description                                     | Key Combination            |
| ----------------------------------------------- | -------------------------- |
| Mark In / Out                                   | `M`                        |
| Split Active Marker                             | `.`                        |
| Delete Active Marker                            | `N`                        |
| Toggle Previous Marker                          | `/`                        |
| Toggle Next Marker                              | `Shift + /`                |
| Set Start of Active Marker to Playhead Position | `I`                        |
| Set End of Active Marker to Playhead Position   | `O`                        |
| Set Playhead to Start of Active Marker          | `[`                        |
| Set Playhead to End of Active Marker            | `]`                        |
| Rewind 3 Seconds and Play to Current Playhead   | `Cmd / Ctrl + Arrow Left`  |
| Play 3 Seconds and Rewind to Current Playhead   | `Cmd / Ctrl + Arrow Right` |
| Loop on Active Marker                           | `P`                        |

## OmakaseMarkerListComponent

A component that bootstraps [Marker List](https://api.player.byomakase.org/interfaces/MarkerListApi.html).

```js
{ omakasePlayer && source && (
  <OmakaseMarkerListComponent
    omakasePlayer={omakasePlayer}
    config={{
      ...MARKER_LIST_CONFIG,
      source: source,
      thumbnailVttFile: omakasePlayer.timeline!.thumbnailVttFile,
    }}
    onCreateMarkerListCallback={(markerListApi) => console.log(markerListApi)}
  />
  )
}
```

The following properties are present:

- `omakasePlayer`: A reference to the OmakasePlayer instance
- `config`: A [config](https://api.player.byomakase.org/interfaces/MarkerListConfig.html) used for marker list configuration
- `onCreateMarkerListCallback`: A function that accepts `markerListApi`. The function is called when marker list is instantiated

## OmakasePlayerTamsComponent

A component that wraps OmakasePlayerComponent with ability to natively play media content stored in [TAMS](https://github.com/bbc/tams).

```js
return (
  <OmakaseTamsPlayerComponent
    flow={flow}
    childFlows={childFlows}
    flowSegments={flowSegments}
    childFlowsSegments={childFlowsSegments}
    videoLoadOptions={videoLoadOptions}
    onVideoLoadedCallback={(omakasePlayer, video) =>
      handleVideoLoaded(omakasePlayer, video)
    }
    config={{ mediaChrome: "enabled" }}
    timerange={timeRange}
    enableHotkey={true}
  />
);
```

The following properties are present:

- `flow`: An object representing the main [flow](https://bbc.github.io/tams/main/index.html#/schemas/flow).
- `childFlow`: An object representing the subflows to be included in HLS manifest
- `flowSegments`: A list of [flow Segments](https://bbc.github.io/tams/main/index.html#/schemas/flow-segment) of the main flow
- `childFlowSegments`: A map of subflow Ids and sublfow segments
- `timerange`: A [timerange](https://bbc.github.io/tams/main/index.html#/schemas/timerange) string of flows to be included in HLS manifest
- `videoLoadOptions`: Object representing [options](https://api.player.byomakase.org/interfaces/VideoLoadOptions.html) used for video loading.
- `onVideoLoadedCallback`: Callback called after initial video load. Useful for retrieving OmakasePlayer instance.
- `config`: Object representing the omakase player's [configuration](https://api.player.byomakase.org/interfaces/OmakasePlayerConfig.html). If `playerHTMLElementId` property is not set it will default to `omakase-player`.
- `enableHotkeys`: A boolean used to enable or disable hot keys. Defaults to `true`

### Hot keys

The hot keys are the same as OmakasePlayerComponent

## OmakaseTimeRangePicker

A wrapper around HTML component used to navigate infinite timelines modified for TAMS.

```js
return (
  <OmakaseTimeRangePicker
    numberOfSegments={6}
    maxSliderRange={1800}
    segmentSize={600}
    timeRange={timeRange}
    maxTimeRange={maxTimeRange}
    onCheckmarkClickCallback={(start, end) => {
      console.log(start, end);
    }}
  />
);
```

The following properties are present:

- `numberOfSegments`: A number representing the amount of time segments to be displayed
- `maxSliderRange`: A number representing a maximum duration of timerange in seconds that slider can select
- `segmentSize`: A number representing a duration of a time segment in seconds
- `timerange`: A timerange string of initially selected timerange
- `maxTimeRange`: A timerange string representing the range slider can navigate in
- `onCheckmarkClickCallback`: A function called when new timerange is selected by moving and/or stretching the slider

## Tips

- Be mindful about props changes to Omakase components as every rerender will force either a timeline rerender (potentially expensive if timeline is rich) or a player reload (playback will stop and commence from the start)
- Components are designed to work under a parent component that manages the shared state (e.g. selected marker, source)
- Customizing Marker List Component can be done with either a `<div>` or `<template>`. Since react can't parse `<template>` tags, either use `<div>` or create a component that injects template to dom on mount
