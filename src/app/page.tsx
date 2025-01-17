"use client";

import React, { useEffect, useState } from "react";

import { Advocate } from "./types/advocate";

const Home: React.FC = () => {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

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
    const text: string = e.target.value.toLowerCase();
    // keep case user entered for display purposes
    setSearchTerm(e.target.value);

    if (text === "") {
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
            property.toLowerCase().includes(text)
          );
        }
      );

      setFilteredAdvocates(filteredAdvocates);
    }
  };

  const onClick = () => {
    console.log(advocates);
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
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr key={advocate.id}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
};

export default Home;
