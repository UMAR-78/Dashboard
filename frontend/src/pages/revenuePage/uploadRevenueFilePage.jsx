import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./revenuePage.css";
import { toast } from "react-toastify";


const expectedColumnNames = [
  "Data",
  "Prox scadenza",
  "Doc",
  "Num",
  "Saldato",
  "Prodotto",
  "Cliente",
  "Comune",
  "Prov",
  "CAP",
  "Paese",
  "Valuta",
  "Imponibile",
  "IVA",
  "Lordo",
];

const uploadRevenueFilePage = () => {
  const [fileData, setFileData] = useState([]);
  const [error, setError] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);

  const handleFileUpload = (e) => {
    const files = e.target.files;
    const fileDataArray = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target.result;
        const workbook = XLSX.read(result, { type: "binary" });
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            cellDates: true,
            raw: false,
          });

          const fileColumnNames = data[0].map((colName) => colName.trim());
          const missingColumns = expectedColumnNames.filter(
            (colName) => !fileColumnNames.includes(colName.trim())
          );

          if (missingColumns.length === 0) {
            fileDataArray.push({
              fileName: file.name,
              sheetName,
              columnNames: data[0].map((colName) => colName.trim()), // Extract column names from the first row and remove leading/trailing whitespaces
              data: data.slice(1), // Exclude the first row (column names)
            });
          } else {
            toast.error(
              `File '${file.name}' is missing columns: ${missingColumns.join(
                ", "
              )}`
            );
          }
        });
        setFileData(fileDataArray);
        setIsFileSelected(true);
      };

      reader.readAsBinaryString(file);
    }
  };

  const uploadToDatabase = async () => {
    try {
      // Filter out completely null rows from each file's data
      const filteredFileData = fileData.map((file) => ({
        ...file,
        data: file.data.filter((row) =>
          row.some((cell) => cell !== null && cell !== "")
        ),
      })).filter((file) => file.data.length > 0); // Only keep files with at least one row of data

      // Send each file's data to the backend
      await Promise.all(filteredFileData.map(async (file) => {
        const response = await fetch(
          "http://localhost:5000/admin/api/v1/upload-revenue-file",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileName: file.fileName,
              sheetName: file.sheetName,
              columnNames: file.columnNames,
              data: file.data,
            }),
          }
        );

        if (!response.ok) {
          toast.error("Failed to upload to database");
        }

        toast.success("Data uploaded successfully");
      }));

    } catch (error) {
      console.error(error);
      toast.error("Failed to upload to database");
    }
  };

  return (
    <div className="file-uploader">
      <input
        className="inputFile"
        type="file"
        accept=".csv,.xlsx"
        onChange={handleFileUpload}
      />

      {error && <div>{error}</div>}

      {isFileSelected &&
        fileData.map((file, index) => (
          <div key={index} className="table-container">
            <table>
              <thead>
                <tr>
                  {file.columnNames.map((header, headerIndex) => (
                    <th key={headerIndex}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {file.data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>
                        {cell instanceof Date
                          ? cell.toLocaleDateString()
                          : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      {isFileSelected && (
        <div>
          <button
            className="button-upload-to-database cost-page-upload-button"
            onClick={uploadToDatabase}
          >
            Upload to Database
          </button>
        </div>
      )}
    </div>
  );
};

export default uploadRevenueFilePage;
