import React from "react";
import LazyLoad from "react-lazyload";

const Placeholder1 = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <LazyLoad>
        <img src="/image/placeholder.svg" alt="Placeholder"
                     style={{ width: "100%", height: "100%" }} />
      </LazyLoad>
    </div>
  );
};

export default Placeholder1;
