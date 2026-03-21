import React from "react";

export const Hero: React.FC = () => {
  return (
    <section className="h-screen hero-bg w-full relative grid grid-cols-2">
      <div className="col-start-2 col-end-3 max-w-2xl bg-[#FFF3E3] px-8 py-12 rounded-[10px] h-fit mt-14">
        <p className="font-semibold text-gray-900 leading-tight">New Arrival</p>
        <h1 className="font-bold text-[52px] text-primary max-w-100 ">
          Discover Our New Collection
        </h1>

        <p className="mt-6 para text-lg">
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
