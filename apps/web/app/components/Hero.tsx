import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <a
            href="https://github.com/ayushkumarverma666/excness"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-200 text-gray-700 bg-white px-4 py-1.5 rounded-full hover:bg-gray-50 transition-colors font-dm-sans font-medium text-sm flex items-center gap-1.5"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                clipRule="evenodd"
              />
            </svg>
            Star on GitHub
          </a>
        </div>
        <h1 className="text-4xl md:text-6xl font-medium text-gray-950 leading-tight mb-4 font-dm-sans tracking-tighter">
          Turn{" "}
          <span className="italic font-instrument-serif tracking-normal">
            Market Volatility
          </span>{" "}
          into <br /> Opportunity with exness
        </h1>

        <p className="text-sm md:text-md text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed font-ibm-plex-mono">
          Step into a calm, focused trading interface built to help you trade
          with clarity and consistency.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
          <Link
            href="/marketplace"
            className="bg-gray-100 border border-gray-300 text-gray-900 px-8 py-2 rounded-full hover:bg-gray-200 transition-colors font-dm-sans font-medium text-lg w-full sm:w-auto cursor-pointer text-center"
          >
            Let&apos;s trade
          </Link>
          <Link
            href="/docs"
            className="border border-gray-300 text-gray-900 bg-white px-8 py-2 rounded-full hover:bg-gray-50 transition-colors font-dm-sans font-medium text-lg w-full sm:w-auto cursor-pointer text-center"
          >
            Read Docs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
