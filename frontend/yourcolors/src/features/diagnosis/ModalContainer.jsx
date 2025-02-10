// components/ModalContainer.jsx
import React from "react";
import "./ModalContainer.css";

const ModalContainer = ({ children }) => {
  return (
    <div className="modal-container">
      {children}
    </div>
  );
};

export default ModalContainer;
