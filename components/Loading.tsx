import React from "react";
import { svgLoading } from "./svgPaths";

const Loading = () => {
  return (
    <div className={`flex justify-center items-center h-[500px]`}>
      <span className={`slow-spin`}>{svgLoading}</span>
    </div>
  );
};

export default Loading;
