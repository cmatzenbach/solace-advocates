"use client";

import React, { useEffect, useState } from "react";

import { Advocate } from "./types/advocate";

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
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
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
      <table className="border-collapse mt-25 mb-25 text-lg shadow-neutral-950 w-full">
        <thead>
          <tr className="bg-solace text-white text-left">
            {displayProperties.map((prop) => (
              <th className="py-12 px-15">{prop}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate, index) => {
            return (
              <tr
                key={advocate.id}
                className={`${
                  index % 2 === 0
                    ? "bg-gray-200"
                    : "border-b odd:border-gray-400"
                }`}
              >
                <td className="py-12 px-15">{advocate.firstName}</td>
                <td className="py-12 px-15">{advocate.lastName}</td>
                <td className="py-12 px-15">{advocate.city}</td>
                <td className="py-12 px-15">{advocate.degree}</td>
                <td className="py-12 px-15">
                  {advocate.specialties.map((s) => (
                    <div>{s}</div>
                  ))}
                </td>
                <td className="py-12 px-15">{advocate.yearsOfExperience}</td>
                <td className="py-12 px-15">{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
};

export default Home;
