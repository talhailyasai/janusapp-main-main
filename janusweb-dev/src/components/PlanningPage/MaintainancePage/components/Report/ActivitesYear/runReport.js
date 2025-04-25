import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PTSans from "../../../../../../utils/font";

exports.RunReport = () => {
  const handlePrint = async () => {
    let pdf = new jsPDF({ orientation: "portrait" });

    pdf.addFileToVFS("PTSans-Regular.ttf", PTSans);
    pdf.addFont("PTSans-Regular.ttf", "PTSans", "normal", "bold");

    // add content here

    pdf.html(
      <div>
        <h1>Hi there h1</h1>
        <h2>Hi there h2</h2>
      </div>,
      {
        callback: function (doc) {},
        x: 10,
        y: 10,
      }
    );

    pdf.save("download");
  };

  return (
    <>
      <button onClick={handlePrint}>print</button>
    </>
  );
};
