import React from 'react';

export default function PanchangBanner() {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'long'
  });

  return (
    <section className="bg-[#241631] text-[#F7EEDC] pt-2 pb-10 relative overflow-hidden">
      {/* Diya Glow Ellipse */}
      <div className="absolute left-1/2 -top-[170px] w-[620px] h-[420px] -translate-x-1/2 diya-glow pointer-events-none" />

      <div className="max-w-[1080px] mx-auto px-4.5 relative z-10 text-center pt-4.5">
        <h1 className="font-['Tiro_Devanagari_Hindi',serif] font-normal text-[26px] sm:text-[34px] md:text-[38px] leading-[1.28] mb-2 text-white">
          Everything our community needs, in one place
        </h1>
        <p className="mx-auto max-w-[44ch] text-[#D3C2CF] text-base sm:text-[17px] leading-relaxed">
          Find a pandit, a match, a mandal event or a helping hand — no account needed to look around.
        </p>

        {/* Panchang Bar */}
        <dl className="flex flex-wrap justify-center gap-0 mt-6.5 mx-auto max-w-[760px] border border-[#4A3358] rounded-2xl bg-[#2D1C3C] overflow-hidden shadow-xl">
          <div className="flex-1 basis-[150px] p-3 sm:px-4 text-left border-r border-[#4A3358] last:border-r-0 max-sm:border-b max-sm:border-[#4A3358]">
            <dt className="text-[12.5px] text-[#A28FA6]">Today</dt>
            <dd className="m-0 mt-0.5 text-[15.5px] font-medium text-white">{currentDate}</dd>
          </div>
          <div className="flex-1 basis-[150px] p-3 sm:px-4 text-left border-r border-[#4A3358] last:border-r-0 max-sm:border-b max-sm:border-[#4A3358]">
            <dt className="text-[12.5px] text-[#A28FA6]">Tithi</dt>
            <dd className="m-0 mt-0.5 text-[15.5px] font-medium text-white">Shukla Ashtami</dd>
          </div>
          <div className="flex-1 basis-[150px] p-3 sm:px-4 text-left border-r border-[#4A3358] last:border-r-0">
            <dt className="text-[12.5px] text-[#A28FA6]">Rahu kaal</dt>
            <dd className="m-0 mt-0.5 text-[15.5px] font-medium text-[#F3AC7A]">9:10 – 10:40 am</dd>
          </div>
          <div className="flex-1 basis-[150px] p-3 sm:px-4 text-left border-r-0">
            <dt className="text-[12.5px] text-[#A28FA6]">Sandhya aarti</dt>
            <dd className="m-0 mt-0.5 text-[15.5px] font-medium text-white">7:00 pm</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
