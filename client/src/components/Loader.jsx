import React from "react";
import load from "./../assets/load.png";
function Loader() {
  return (
    // Loader component
    <>
      <div
        type="button"
        className="flex flex-row  items-center justify-center text-white font-bold h-[90vh]"
        disabled
      >
        <div className="w-72 bg-primary flex flex-col items-center justify-center p-6 rounded-2xl">
          <img src={load} />
          <p className="text-2xl">Loading...</p>
        </div>
      </div>
    </>
  );
}

export default Loader;
