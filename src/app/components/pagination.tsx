import React from "react";
import { ArrowLeft } from "../icons/arrow-left";
import { ArrowRight } from "../icons/arrow-right";

export const Pagination = ({
  currentPage,
  totalPages,
  setPage,
}: {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
}) => {
  const nextPage = () => {
    if (totalPages > currentPage) {
      setPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage !== 1) {
      setPage(currentPage - 1);
    }
  };

  return (
    <div className="flex items-center gap-4 text-solacePrimary">
      <div onClick={prevPage}>
        <ArrowLeft />
      </div>
      <div className="font-normal">
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </div>
      <div onClick={nextPage}>
        <ArrowRight />
      </div>
    </div>
  );
};
