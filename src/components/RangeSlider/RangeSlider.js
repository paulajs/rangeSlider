import React from "react";

export function RangeSlider(props) {
  const { defaultValue, steps, widthStyle } = props;
  const widthLen = parseInt(widthStyle);
  const widthType = widthStyle.substr(widthLen);

  const [value, setValue] = React.useState(defaultValue);

  const sliderOuterWrapperStyle = {
    height: "40px",
    position: "relative",
  };

  const sliderInnerWrapperStyle = {
    height: "40px",
    width: "200px",
  };

  const sliderStyle = {
    cursor: "pointer",
    height: "40px",
    width: "40px",
    background: "black",
    position: "absolute",
    borderRadius: "100%",
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
      >
        <div className="range-slider-rail-before" style={railBeforeStyle}></div>
        <div className="range-slider-rail-after" style={railAfterStyle}></div>
        <div className="range-slider-slider" style={sliderStyle}></div>
      </div>
      <input type="range" min="1" max="5" style={{ display: "none" }} />
    </div>
  );
}
