import React, { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function App() {
  const [preview, setPreview] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [forecastExpenses, setForecastExpenses] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Safely set state
      setPreview(res.data?.preview ?? []);
      setKpis(res.data?.kpis ?? null);
      setForecast(res.data?.forecast ?? null);
      setForecastExpenses(res.data?.forecast_expenses ?? null);

      // Build chart safely
      const months = (res.data?.preview ?? []).map((_, i) => `Month ${i + 1}`);
      const revenues = (res.data?.preview ?? []).map((row) => row.revenue ?? 0);
      const expenses = (res.data?.preview ?? []).map((row) => row.expenses ?? 0);

      setChartData({
        labels: months,
        datasets: [
          {
            label: "Revenue",
            data: revenues,
            borderColor: "green",
            backgroundColor: "rgba(0,128,0,0.2)",
          },
          {
            label: "Expenses",
            data: expenses,
            borderColor: "red",
            backgroundColor: "rgba(255,0,0,0.2)",
          },
        ],
      });

      setUploadError(null);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadError("Failed to upload CSV. Make sure it has month, revenue, and expenses columns.");
      setPreview([]);
      setKpis(null);
      setForecast(null);
      setForecastExpenses(null);
      setChartData(null);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Business Data Dashboard</h1>

      <input type="file" onChange={handleUpload} />

      {uploadError && (
        <p style={{ color: "red", fontWeight: "bold" }}>{uploadError}</p>
      )}

      <hr />

      {kpis && (
        <div>
          <h2>KPIs</h2>
          <p><strong>Total Revenue:</strong> ${kpis.total_revenue ?? 0}</p>
          <p><strong>Total Expenses:</strong> ${kpis.total_expenses ?? 0}</p>
          <p><strong>Profit:</strong> ${kpis.profit ?? 0}</p>
          <p><strong>Profit Margin:</strong> {kpis.profit_margin != null ? (kpis.profit_margin * 100).toFixed(2) : 0}%</p>

          <h3>Next Month Predictions</h3>
          <p><strong>Revenue:</strong> ${forecast ?? 0}</p>
          <p><strong>Expenses:</strong> ${forecastExpenses ?? 0}</p>
        </div>
      )}

      <hr />

      {chartData && chartData.labels && chartData.datasets && (
        <div style={{ width: "600px" }}>
          <h2>Revenue vs Expenses Chart</h2>
          <Line data={chartData} />
        </div>
      )}

      <hr />

      {preview && preview.length > 0 && preview[0] && (
        <div>
          <h2>Data Preview</h2>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                {Object.keys(preview[0]).map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
