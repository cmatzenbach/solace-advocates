"use client";

import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { fetchAdvocates } from "./utils/routes";

import { Advocate } from "./types/advocate";
import { WaveMid } from "./svg/wave-mid";
import { ClearIcon } from "./icons/clear-icon";
import { Pagination } from "./components/pagination";

const DISPLAY_PROPERTIES = [
  "First Name",
  "Last Name",
  "City",
  "Degree",
  "Specialties",
  "Years of Experience",
  "Phone Number",
];

const AdvocateRow = React.memo(
  ({ advocate, index }: { advocate: Advocate; index: number }) => (
    <tr
      key={advocate.id}
      className={`border-b border-slate-400 hover:bg-gray-100 ${
        index % 2 === 0 ? "bg-gray-50" : ""
      }`}
    >
      <td className="py-6 px-16">{advocate.firstName}</td>
      <td className="py-6 px-16">{advocate.lastName}</td>
      <td className="py-6 px-16">{advocate.city}</td>
      <td className="py-6 px-16">{advocate.degree}</td>
      <td className="py-6 px-16">
        {advocate.specialties.map((s, i) => (
          <div key={i}>{s}</div>
        ))}
      </td>
      <td className="py-6 px-16">{advocate.yearsOfExperience}</td>
      <td className="py-6 px-16">{advocate.phoneNumber}</td>
    </tr>
  )
);

const Home: React.FC = () => {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const debouncedFetchData = debounce(
    async (page: number, searchTerm: string) => {
      try {
        const { data } = await fetchAdvocates(page, 20, searchTerm);
        setAdvocates(data);
      } catch (error) {
        console.error("Error fetching advocates:", error);
      }
    },
    300
  );

  const fetchData = useCallback(() => {
    debouncedFetchData(page, searchTerm);
  }, [page, searchTerm, debouncedFetchData]);

  useEffect(() => {
    fetchData();
  }, [page, searchTerm]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onClick = () => {
    setSearchTerm("");
  };

  return (
    <main className="antialiased">
      <div className="bg-gradient-to-b from-bannerFadeDark to-bannerFadeLight py-8 text-white text-center">
        <p className="font-mollieGlaston text-5xl">Solace Advocates</p>
        <p className="pt-4 text-lg">
          Use the following tool to find available advocates in your area
        </p>
      </div>
      <div className="w-full mt-[-9px]">
        <WaveMid />
      </div>

      <div className="m-16">
        <div className="flex items-center mb-4">
          <input
            className="w-1/4 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border-2 border-slate-500 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-solacePrimary hover:border-solacePrimary shadow-sm focus:shadow"
            placeholder="Search Term"
            value={searchTerm}
            onChange={onChange}
          />

          <div className="ml-2 cursor-pointer" onClick={onClick}>
            <ClearIcon styles="size-8 text-red-400 hover:text-red-500" />
          </div>

          <div className="ml-auto">
            <Pagination
              currentPage={page}
              totalPages={page}
              setPage={setPage}
            />
          </div>
        </div>
        <table className="border-collapse mx-25 text-md shadow-lg min-w-96 rounded-xl overflow-hidden w-full">
          <thead>
            <tr className="bg-solacePrimary text-white text-left font-bold border-b border-slate-400">
              {DISPLAY_PROPERTIES.map((prop) => (
                <th className="py-6 px-16" key={prop}>
                  {prop}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {advocates.map((advocate, index) => (
              <AdvocateRow
                key={advocate.id}
                advocate={advocate}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Home;
