import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Chart from "chart.js/auto";
import "./revenueStats.css";

const RevenueStats = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [fileData, setFileData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [barChart, setBarChart] = useState(null);
  const [lineChart, setLineChart] = useState(null);
  const [pieChart, setPieChart] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/admin/api/v1/getRevenueFiles"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch files");
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
        `http://localhost:5000/admin/api/v1/getRevenueData/${selectedFile}`
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
      renderCharts();
    }
  }, [fileData]);

  const renderCharts = () => {
    const aggregateDataByMonth = () => {
      const aggregatedData = {};
      fileData.slice(1).forEach((rowData) => {
        const month = rowData.rowData[0].split("/")[1]; // Extracting month from the date string
        const product = rowData.rowData[5];
        const revenue = parseFloat(rowData.rowData[14].replace("EUR ", "").replace(",", ""));
        if (!aggregatedData[month]) {
          aggregatedData[month] = {};
        }
        if (!aggregatedData[month][product]) {
          aggregatedData[month][product] = 0;
        }
        aggregatedData[month][product] += revenue;
      });
      return aggregatedData;
    };

    const aggregatedData = aggregateDataByMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Bar Chart
    const chartLabels = Object.keys(aggregatedData).sort((a, b) => a - b);
    const products = fileData.reduce((products, data) => {
      if (data.rowData) {
        const product = data.rowData[5];
        if (!products.includes(product)) {
          products.push(product);
        }
      }
      return products;
    }, []);

    const chartData = products.map((product) => {
      return chartLabels.map((month) => aggregatedData[month][product] || 0);
    });

    const barCtx = document.getElementById("barChart").getContext("2d");

    if (barChart) {
      barChart.destroy();
    }

    // const colors = ['#0088fe', '#00c49f', '#ff8042', '#ffbb28']; // Define your own color palette
    const colors = ['#0088fe', '#00c49f', '#ff8042', '#ffbb28' ,'#8884d8' ,  '#aa8c51' , '#32cd32' , '#0e676d'];
    const newBarChart = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: products,
        datasets: chartLabels.map((month, index) => ({
          label: monthNames[parseInt(month) - 1],
          data: chartData.map((data) => data[index]),
          backgroundColor: colors[index % colors.length], // Use modulo operator to cycle through colors if there are more products than colors
          borderColor: colors[index % colors.length],
          borderWidth: 1,
        })),
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
          },
        },
        animation: {
          duration: 0,
        },
      },
    });

    setBarChart(newBarChart);

    // Line Chart
    const lineCtx = document.getElementById("lineChart").getContext("2d");
    if (lineChart) {
      lineChart.destroy();
    }
    const newLineChart = new Chart(lineCtx, {
      type: "line",
      data: {
        labels: chartLabels.map((month) => monthNames[parseInt(month) - 1]),
        datasets: products.map((product, index) => ({
          label: product,
          data: chartData[index],
          fill: false,
          borderColor: colors[index % colors.length],
          borderWidth: 1,
        })),
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
          },
        },
        animation: {
          duration: 0,
        },
      },
    });

    setLineChart(newLineChart);

    // Pie Chart
    const pieCtx = document.getElementById("pieChart").getContext("2d");
    if (pieChart) {
      pieChart.destroy();
    }
    const pieData = Object.values(aggregatedData).reduce((acc, data) => {
      Object.values(data).forEach((value, index) => {
        if (!acc[index]) {
          acc[index] = 0;
        }
        acc[index] += value;
      });
      return acc;
    }, []);
    const newPieChart = new Chart(pieCtx, {
      type: "pie",
      data: {
        labels: products,
        datasets: [
          {
            data: pieData,
            backgroundColor: colors,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        animation: {
          duration: 0,
        },
      },
    });

    setPieChart(newPieChart);
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
                  {fileData.length > 0 &&
                    fileData[0].columnNames.map((columnName, index) => (
                      <th key={index}>{columnName}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {fileData.slice(1).map((rowData, rowIndex) => (
                  <tr key={rowIndex}>
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
          <canvas id="barChart" />
          <canvas id="lineChart" />
          <canvas id="pieChart" />
      </div>
    </div>
  );
};

export default RevenueStats;
