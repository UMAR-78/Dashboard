import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Chart from "chart.js/auto"; // Import Chart.js
import "./revenueStats.css";

const RevenueStats = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [fileData, setFileData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [barChart, setBarChart] = useState(null);
  const [lineChart, setLineChart] = useState(null);
  // const [pieChart, setPieChart] = useState(null);


  useEffect(() => {
    // Fetch files from the database
    const fetchFiles = async () => {
      try {
        const response = await fetch(
          `${window.location.origin}/getRevenueFiles`
        );
        if (!response.ok) {
          toast.error("Failed to fetch files");
        }
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch files");
      }
    };
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.value);
  };

  const fetchDataForSelectedFile = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${window.location.origin}/${selectedFile}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data for selected file");
      }
      const data = await response.json();
      setFileData(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch data for selected file");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      fetchDataForSelectedFile();
    }
  }, [selectedFile]);

  useEffect(() => {
    if (fileData.length > 0) {
      renderCharts(); // Render the charts whenever fileData changes
    }
  }, [fileData]);

  const renderCharts = () => {
    // Prepare chart data based on fileData
    const chartLabels = fileData.slice(1).map((rowData) => rowData.rowData[5]); // Assuming "Prodotto" is the column containing revenue types
    const chartValues1 = fileData
      .slice(1)
      .map((rowData) =>
        parseFloat(rowData.rowData[12].replace("EUR ", "").replace(",", ""))
      ); // Assuming "Imponibile" is the column containing revenue values
    const chartValues2 = fileData
      .slice(1)
      .map((rowData) =>
        parseFloat(rowData.rowData[13].replace("EUR ", "").replace(",", ""))
      ); // Assuming "Imponibile" is the column containing revenue values
    const chartValues3 = fileData
      .slice(1)
      .map((rowData) =>
        parseFloat(rowData.rowData[14].replace("EUR ", "").replace(",", ""))
      ); // Assuming "Imponibile" is the column containing revenue values

    const barCtx = document.getElementById("barChart").getContext("2d");
    const lineCtx = document.getElementById("lineChart").getContext("2d");
    // const pieCtx = document.getElementById("pieChart").getContext("2d");


    // Destroy previous charts if they exist
    if (barChart) {
      barChart.destroy();
    }
    if (lineChart) {
      lineChart.destroy();
    }
    // if (pieChart) {
    //   pieChart.destroy();
    // }

    // Render bar chart
    const newBarChart = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Imponibile",
            data: chartValues1,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "IVA",
            data: chartValues2,
            backgroundColor: "rgba(255, 99, 132, 0)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "Lordo",
            data: chartValues3,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        animation: {
          duration: 0,
        },
      },
    });

    // Render line chart
    const newLineChart = new Chart(lineCtx, {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Imponibile",
            data: chartValues1,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "IVA",
            data: chartValues2,
            backgroundColor: "rgba(255, 99, 132, 0)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "Lordo",
            data: chartValues3,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        animation: {
          duration: 0,
        },
      },
    });
    // const newPieChart = new Chart(pieCtx, {
    //   type: "doughnut",
    //   data: {
    //     labels: chartLabels,
    //     datasets: [
    //       {
    //         label: "Imponibile",
    //         data: chartValues1,
    //         backgroundColor: "rgba(75, 192, 192, 0.2)",
    //         borderColor: "rgba(75, 192, 192, 1)",
    //         borderWidth: 1,
    //       },
    //       {
    //         label: "IVA",
    //         data: chartValues2,
    //         backgroundColor: "rgba(255, 99, 132, 0)",
    //         borderColor: "rgba(255, 99, 132, 1)",
    //         borderWidth: 1,
    //       },
    //       {
    //         label: "Lordo",
    //         data: chartValues3,
    //         backgroundColor: "rgba(54, 162, 235, 0.2)",
    //         borderColor: "rgba(54, 162, 235, 1)",
    //         borderWidth: 1,
    //       },
    //     ],
    //   },
    //   options: {
    //     maintainAspectRatio: false,
    //     scales: {
    //       y: {
    //         beginAtZero: true,
    //       },
    //     },
    //     animation: {
    //       duration: 0,
    //     },
    //   },
    // });

    // Update state variables for the charts
    setBarChart(newBarChart);
    setLineChart(newLineChart);
    // setPieChart(newPieChart);

  };

  return (
    <div>
      <div className="revenue-stats-container">
        <h2 className="revenue-stats-heading">Revenue Stats</h2>

        <div className="revenue-stats-select-wrapper">
          <div>
            <label className="revenue-stats-label">
              Select File to show data:
            </label>
            <select
              className="revenue-stats-select"
              value={selectedFile}
              onChange={handleFileChange}
            >
              <option value="">Select File</option>
              {files.map((fileName, index) => (
                <option key={index} value={fileName}>
                  {fileName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="revenue-stats-table">
            <h3>Revenue Table</h3>
            <table>
              <thead>
                <tr>
                  {/* Render table headers based on the columnNames of the first document */}
                  {fileData.length > 0 &&
                    fileData[0].columnNames.map((columnName, index) => (
                      <th key={index}>{columnName}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {/* Map over the fileData array starting from index 1 */}
                {fileData.slice(1).map((rowData, rowIndex) => (
                  <tr key={rowIndex}>
                    {/* Render table cells with corresponding data from rowData */}
                    {rowData.rowData.map((cellData, cellIndex) => (
                      <td key={cellIndex}>{cellData}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="revenue-stats-chart">
        {/* Render Chart */}
        <canvas id="barChart" />
        <canvas id="lineChart" />
        {/* <canvas id="pieChart" /> */}

      </div>
    </div>
  );
};

export default RevenueStats;
