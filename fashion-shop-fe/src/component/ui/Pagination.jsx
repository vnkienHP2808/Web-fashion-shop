import React from "react";
import { Pagination } from "react-bootstrap";

const Paginated = ({ totalPages, currentPage, handlePageChange }) => {
  return (
    <Pagination>
      {[...Array(totalPages).keys()].map((number) => (
        <Pagination.Item
          key={number + 1}
          active={number + 1 === currentPage}
          onClick={() => handlePageChange(number + 1)}
        >
          {number + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  );
};

export default Paginated;
