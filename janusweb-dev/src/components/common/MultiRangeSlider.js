import React, { useCallback, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

const MultiRangeSlider = ({ min, max, onChange, name }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // ...........
  const firstRange = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);
  useEffect(() => {
    const currentYear = queryParams.get("currentYear");
    const u_system = queryParams.get("u_system");
    if (currentYear && u_system) {
      const parsedYear = parseInt(currentYear, 10);
      if (!isNaN(parsedYear)) {
        setMinVal(parsedYear); // Set the min value to the current year
        setMaxVal(parsedYear); // Set the max value to the next year
        minValRef.current = parsedYear;
        maxValRef.current = parsedYear;
      }
      // Clear the query parameters after calling handleFindClick
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.delete("currentYear");
      urlParams.delete("u_system");

      // Update the URL
      const newUrl = urlParams.toString()
        ? `${window.location.pathname}?${urlParams.toString()}`
        : `${window.location.pathname}`;

      window.history.pushState({}, "", newUrl);
    }
  }, []);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // ....................umair.................................................
  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (firstRange.current) {
      firstRange.current.style.left = `${minPercent}%`;
      firstRange.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (firstRange.current) {
      firstRange.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // ...........................................................................

  // Get min and max values when their state changes
  // Get min and max values when their state changes
  useEffect(() => {
    if (onChange && (minVal !== min || maxVal !== max))
      onChange(name, [minVal + "-" + maxVal]);
  }, [minVal, maxVal]);
  return (
    <div className="mt-3">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal);
          setMinVal(value);
          minValRef.current = value;
        }}
        className="thumb thumb--left"
        style={{ zIndex: minVal > max - 100 && "5" }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal);
          setMaxVal(value);
          maxValRef.current = value;
        }}
        className="thumb thumb--right"
      />

      <div className="slider">
        <div className="slider__track" />
        <div ref={firstRange} className="slider__range year_range_slider" />
        <div ref={range} className="slider__range" />
      </div>
      <div className="values">
        <div className="slider__left-value">{minVal}</div>
        <div className="slider__right-value">{maxVal}</div>
      </div>
    </div>
  );
};

export default MultiRangeSlider;
