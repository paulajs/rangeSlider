import React from "react";

export function RangeSlider(props) {
  let { defaultValue, steps, widthStyle } = props;
  if (!widthStyle) {
    widthStyle = "400px";
  }
  const widthLen = parseInt(widthStyle);
  const widthType = widthStyle.substr(widthLen);

  const [value, setValue] = React.useState(defaultValue);
  const inputRef = React.useRef();
  const refSlider = React.useRef();
  const refSliderInnerWrapper = React.useRef();

  // TODO throttle
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
      console.log(newPos, sliderWrapperRect.left + sliderWrapperRect.width);
      if (newPos > sliderWrapperRect.width - sliderRect.width) {
        return;
      }
      refSlider.current.style.left = `${newPos}px`;
    },
    [refSlider]
  );

  const dragHandler = () => {
    window.addEventListener("mousemove", onDragging);
    window.addEventListener("mouseup", onDragStop);
  };

  const onDragStop = () => {
    window.removeEventListener("mousemove", onDragging);
    window.removeEventListener("mouseup", dragHandler);
  };

  const sliderOuterWrapperStyle = {
    height: "40px",
    position: "relative",
  };

  const sliderInnerWrapperStyle = {
    height: "40px",
  };

  const sliderStyle = {
    cursor: "pointer",
    height: "40px",
    width: "40px",
    background: "black",
    position: "absolute",
    borderRadius: "100%",
    outline: "none",
  };

  const railSharedStyle = {
    marginTop: "10px",
    height: "20px",
    display: "block",
    width: "100%",
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
        <div className="range-slider-rail-before" style={railBeforeStyle}></div>
        <div className="range-slider-rail-after" style={railAfterStyle}></div>
        <div
          ref={refSlider}
          className="range-slider-slider"
          style={sliderStyle}
          onMouseDown={dragHandler}
        ></div>
      </div>
      <input
        ref={inputRef}
        type="range"
        min="1"
        max={`${steps}`}
        style={{ display: "none" }}
      />
    </div>
  );
}
