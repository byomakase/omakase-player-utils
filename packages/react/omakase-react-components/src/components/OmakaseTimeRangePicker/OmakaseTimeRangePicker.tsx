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

import React, { useEffect } from "react";
import { TimeRangeUtil } from "../../util/time-range-util";
import { OmakaseTimeRangeSelector } from "../../../../../plugins/time-range-selector";
type OmakaseTimerangePickerProps = {
  timeRange: string;
  maxTimeRange: string;
  numberOfSegments: number;
  segmentSize: number;
  maxSliderRange: number;
  onCheckmarkClickCallback: (start: number, end: number) => void;
};

const divId = "omakase-time-range-selector-react-div";
const OmakaseTimeRangePicker = ({
  timeRange,
  maxTimeRange,
  numberOfSegments,
  segmentSize,
  maxSliderRange,
  onCheckmarkClickCallback,
}: OmakaseTimerangePickerProps) => {
  if (!customElements.get("omakase-time-range-selector")) {
    customElements.define(
      "omakase-time-range-selector",
      OmakaseTimeRangeSelector
    );
  }

  useEffect(() => {
    const maxTimeRangeParsed = TimeRangeUtil.parseTimeRange(maxTimeRange);
    const minValue = TimeRangeUtil.timeMomentToSeconds(
      maxTimeRangeParsed.start!
    );
    const maxValue = TimeRangeUtil.timeMomentToSeconds(maxTimeRangeParsed.end!);

    const timeRangeParsed = TimeRangeUtil.parseTimeRange(timeRange);

    const sliderStart = TimeRangeUtil.timeMomentToSeconds(
      timeRangeParsed.start!
    );
    const sliderEnd = TimeRangeUtil.timeMomentToSeconds(timeRangeParsed.end!);

    const timeRangeSelector = new OmakaseTimeRangeSelector();
    timeRangeSelector.setAttribute("minValue", minValue.toString());
    timeRangeSelector.setAttribute("maxValue", maxValue.toString());
    timeRangeSelector.setAttribute("maxRange", maxSliderRange.toString());
    timeRangeSelector.setAttribute("segmentSize", segmentSize.toString());
    timeRangeSelector.setAttribute(
      "numberOfSegments",
      numberOfSegments.toString()
    );
    timeRangeSelector.setAttribute("sliderStart", sliderStart.toString());
    timeRangeSelector.setAttribute("sliderEnd", sliderEnd.toString());
    timeRangeSelector.onCheckmarkClickCallback = onCheckmarkClickCallback;
    document.getElementById(divId)?.append(timeRangeSelector);
  }, []);

  return <div id={divId}></div>;
};

export default OmakaseTimeRangePicker;
