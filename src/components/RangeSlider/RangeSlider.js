import React from "react";

const closestValue = (needle, haystack) => {
  return haystack.reduce((a, b) => {
    let aDiff = Math.abs(a - needle);
    let bDiff = Math.abs(b - needle);

    if (aDiff == bDiff) {
      return a > b ? a : b;
    } else {
      return bDiff < aDiff ? b : a;
    }
  });
};

export function RangeSlider(props) {
  let { sliderName, sliderId, startStep, steps, widthStyle } = props;
  if (!startStep) {
    startStep = 1;
  }
  if (!widthStyle) {
    widthStyle = "400px";
  }
  if (!steps) {
    steps = 4;
  }
  const widthLen = parseInt(widthStyle);

  const [step, setStep] = React.useState(startStep - 1); // zero index inside
  const [snapPoints, setSnapPoints] = React.useState([]);
  const [sliderPosition, setSliderPosition] = React.useState(0);
  const inputRef = React.useRef();
  const refSlider = React.useRef();
  const refSliderInnerWrapper = React.useRef();
  const refRailBefore = React.useRef();
  const refRailAfter = React.useRef();

  // setup snap points
  React.useEffect(() => {
    const sliderRect = refSlider.current.getBoundingClientRect();
    const sliderWrapperRect = refSliderInnerWrapper.current.getBoundingClientRect();
    const snapWidth = sliderWrapperRect.width / (steps - 1);
    const points = [];
    for (let i = 0; i < steps; i++) {
      points.push(i && i * snapWidth - sliderRect.width);
    }
    setSnapPoints(points);
  }, []);

  React.useEffect(() => {
    const newPos = snapPoints[step];
    setSliderPosition(newPos);
  }, [step, snapPoints]);

  // TODO debounce
  const onDragging = React.useCallback(
    (mEvent) => {
      const sliderWrapperRect = refSliderInnerWrapper.current.getBoundingClientRect();
      const sliderRect = refSlider.current.getBoundingClientRect();
      const sliderCenterOffset = sliderRect.width / 2;
      const newPos =
        mEvent.screenX - sliderWrapperRect.left - sliderCenterOffset;
      // only animate if within slider rail
      if (newPos < 0) {
        return;
      }
      if (newPos > sliderWrapperRect.width - sliderRect.width) {
        return;
      }
      // set slider
      refSlider.current.style.left = `${newPos}px`;
      // set before rail
      refRailBefore.current.style.width = refSlider.current.style.left;
      const sliderMiddle = parseInt(sliderRect.width) / 2;
      refRailBefore.current.style.marginLeft = `${sliderMiddle}px`;
      // set after rail
      const wrapperRect = refSliderInnerWrapper.current.getBoundingClientRect();
      refRailAfter.current.style.marginLeft = `${newPos + sliderMiddle}px`;

      refRailAfter.current.style.width = `${parseInt(
        wrapperRect.width - newPos - parseInt(sliderRect.width)
      )}px`;
    },
    [refSlider]
  );

  const dragHandler = () => {
    window.addEventListener("mousemove", onDragging);
    window.addEventListener("mouseup", onDragStop);
  };

  const onDragStop = React.useCallback(() => {
    window.removeEventListener("mousemove", onDragging);
    window.removeEventListener("mouseup", onDragStop);
    const v = refSlider.current.style.left;
    setSliderPosition(parseInt(v));
  });

  const sliderOuterWrapperStyle = {
    height: "40px",
    width: widthStyle,
    position: "relative",
  };

  const sliderInnerWrapperStyle = {
    height: "40px",
  };

  const setImmediateStyles = () => {
    // snap the slider the snapPoints closest, set the rail widths and margins
    const sliderSnappedPosition =
      sliderPosition && snapPoints && closestValue(sliderPosition, snapPoints);
    if (
      refSlider.current &&
      refRailAfter.current &&
      refRailBefore.current &&
      refSliderInnerWrapper.current
    ) {
      // set snapped slider position
      refSlider.current.style.left = `${sliderSnappedPosition || 0}px`;
      // set before rail
      refRailBefore.current.style.width = refSlider.current.style.left;
      const sliderRect = refSlider.current.getBoundingClientRect();
      const sliderMiddle = parseInt(sliderRect.width) / 2;
      refRailBefore.current.style.marginLeft = `${sliderMiddle}px`;
      // set after rail
      const wrapperRect = refSliderInnerWrapper.current.getBoundingClientRect();
      refRailAfter.current.style.marginLeft = `${
        sliderSnappedPosition + sliderMiddle
      }px`;

      refRailAfter.current.style.width = `${parseInt(
        wrapperRect.width - sliderSnappedPosition - parseInt(sliderRect.width)
      )}px`;
    }
  };

  setImmediateStyles();

  const sliderStyle = {
    cursor: "pointer",
    height: "40px",
    width: "40px",
    background: "black",
    position: "absolute",
    borderRadius: "100%",
    userSelect: "none",
  };

  const railSharedStyle = {
    marginTop: "10px",
    height: "20px",
    display: "block",
    position: "absolute",
  };

  const railAfterStyle = {
    ...railSharedStyle,
    background: "red",
  };

  const railBeforeStyle = {
    ...railSharedStyle,
    background: "green",
  };

  return (
    <div className="range-slider-outer-wrapper" style={sliderOuterWrapperStyle}>
      <div
        className="range-slider-inner-wrapper"
        style={sliderInnerWrapperStyle}
        ref={refSliderInnerWrapper}
      >
        <div
          ref={refRailBefore}
          className="range-slider-rail-before"
          style={railBeforeStyle}
        ></div>
        <div
          ref={refRailAfter}
          className="range-slider-rail-after"
          style={railAfterStyle}
        ></div>
        <div
          ref={refSlider}
          className="range-slider-slider"
          style={sliderStyle}
          onMouseDown={dragHandler}
        ></div>
      </div>
      <input
        name={sliderName}
        id={sliderId}
        ref={inputRef}
        type="range"
        min="1"
        max={`${steps}`}
        defaultValue={step}
        style={{ display: "none" }}
      />
    </div>
  );
}
