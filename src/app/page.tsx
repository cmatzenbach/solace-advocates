"use client";

import React, { useEffect, useState } from "react";

import { Advocate } from "./types/advocate";
import { WaveDark } from "./svg/wave-dark";
import { WaveMid } from "./svg/wave-mid";

const Home: React.FC = () => {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const displayProperties = [
    "First Name",
    "Last Name",
    "City",
    "Degree",
    "Specialties",
    "Years of Experience",
    "Phone Number",
  ];

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        const response = await fetch("/api/advocates");
        const data = await response.json();
        setAdvocates(data.data);
        setFilteredAdvocates(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAdvocates();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // make search case-insensative
    const searchText: string = e.target.value.toLowerCase();
    // keep case user entered for display purposes
    setSearchTerm(e.target.value);

    if (searchText === "") {
      // if user clears search entry, reset table
      setFilteredAdvocates(advocates);
    } else {
      const filteredAdvocates: Advocate[] = advocates.filter(
        (advocate: Advocate) => {
          const searchableProperties = [
            advocate.firstName,
            advocate.lastName,
            advocate.city,
            advocate.degree,
            ...advocate.specialties,
            advocate.yearsOfExperience.toString(),
          ];
          console.log(searchableProperties);

          return searchableProperties.some((property) =>
            property.toLowerCase().includes(searchText)
          );
        }
      );

      setFilteredAdvocates(filteredAdvocates);
    }
  };

  const onClick = () => {
    setFilteredAdvocates(advocates);
  };

  return (
    <main className="antialiased">
      <div className="w-full mb-[-8px]">
        <WaveDark />
      </div>
      <div className="bg-gradient-to-b from-bannerFadeDark to-bannerFadeLight py-8 text-white text-center">
        <p className="font-mollieGlaston text-5xl">Solace Advocates</p>
        <p className="pt-4">
          Use the following tool to find available advocates in your area
        </p>
      </div>
      <div className="w-full mt-[-9px]">
        <WaveMid />
      </div>

      <div className="m-16">
        <div>
          <p>Search</p>
          <p>
            Searching for: <span id="search-term">{searchTerm}</span>
          </p>
          <input
            style={{ border: "1px solid black" }}
            value={searchTerm}
            onChange={onChange}
          />
          <button onClick={onClick}>Reset Search</button>
        </div>
        <br />
        <br />
        <table className="border-collapse mx-25 text-md shadow-lg min-w-96 rounded-xl overflow-hidden w-full">
          <thead>
            <tr className="bg-solacePrimary text-white text-left font-bold border-b border-slate-400">
              {displayProperties.map((prop) => (
                <th className="py-6 px-16" key={prop}>
                  {prop}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate, index) => {
              return (
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
                    {advocate.specialties.map((s) => (
                      <div>{s}</div>
                    ))}
                  </td>
                  <td className="py-6 px-16">{advocate.yearsOfExperience}</td>
                  <td className="py-6 px-16">{advocate.phoneNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Home;
