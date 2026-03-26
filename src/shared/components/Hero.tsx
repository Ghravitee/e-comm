// import React from "react";

// export const Hero: React.FC = () => {
//   return (
//     <section className="h-screen hero-bg w-full relative grid grid-cols-2">
//       <div className="col-start-2 col-end-3 max-w-2xl bg-[#FFF3E3] px-8 py-12 rounded-[10px] h-fit mt-14">
//         <p className="font-semibold text-gray-900 leading-tight">New Arrival</p>
//         <h1 className="font-bold text-[52px] text-primary max-w-100 ">
//           Discover Our New Collection
//         </h1>

//         <p className="mt-6 para text-lg">
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
//           tellus, luctus nec ullamcorper mattis.
//         </p>

//         <button className="uppercase mt-8 bg-[#B88E2F] text-white font-bold px-12 py-6">
//           Buy now
//         </button>
//       </div>
//     </section>
//   );
// };

import React, { useState } from "react";
import heroImage from "../../assets/scandinavian-interior-mockup-wall-decal-background.png";
import blurImage from "../../assets/scandinavian-interior-mockup-wall-decal-background-blur.jpg";

export const Hero: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="h-screen w-full relative grid grid-cols-2 overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {/* Blur placeholder */}
        <img
          src={blurImage}
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />

        {/* Full image */}
        <img
          src={heroImage}
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          alt="Furniture hero background"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Overlay (optional for readability) */}
      {/* <div className="absolute inset-0 bg-black/20"></div> */}

      {/* Content */}
      <div className="relative col-start-2 col-end-3 max-w-2xl bg-[#FFF3E3] px-8 py-12 rounded-[10px] h-fit mt-14 z-10">
        <p className="font-semibold text-gray-900 leading-tight">New Arrival</p>

        <h1 className="font-bold text-[52px] text-primary max-w-100">
          Discover Our New Collection
        </h1>

        <p className="mt-6 text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
          tellus, luctus nec ullamcorper mattis.
        </p>

        <button className="uppercase mt-8 bg-[#B88E2F] text-white font-bold px-12 py-6">
          Buy now
        </button>
      </div>
    </section>
  );
};
