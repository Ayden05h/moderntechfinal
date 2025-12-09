import React, { useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [csvFile, setCsvFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [forecast, setForecast] = useState(null);

  // Replace with your Cloud Run backend URL
  const BACKEND_URL = "https://backend-1068077487764.us-central1.run.app";

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!csvFile) return alert("Select a CSV file first!");
    try {
      const formData = new FormData();
      formData.append("file", csvFile);

      const res = await axios.post(`${BACKEND_URL}/upload`, formData);
      
      if (res.data.error) {
        alert(res.data.error);
        return;
      }

      setPreview(res.data.preview || []);
      setKpis(res.data.kpis || {});
      setForecast(res.data.forecast || 0);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Make sure CSV has 'month', 'revenue', 'expenses' columns.");
    }
  };

  const chartData = {
    labels: preview.map((row) => row.month || ""),
    datasets: [
      {
        label: "Revenue",
        data: preview.map((row) => row.revenue || 0),
        borderColor: "green",
        backgroundColor: "rgba(0,128,0,0.2)"
      },
      {
        label: "Expenses",
        data: preview.map((row) => row.expenses || 0),
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.2)"
      }
    ]
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CSV</button>

      {preview.length > 0 && (
        <div>
          <h2>Preview</h2>
          <table border="1">
            <thead>
              <tr>
                {Object.keys(preview[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td key={i}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Revenue vs Expenses Chart</h2>
          <Line data={chartData} />
        </div>
      )}

      {kpis && (
        <div>
          <h2>KPIs</h2>
          <p>Total Revenue: {kpis.total_revenue}</p>
          <p>Total Expenses: {kpis.total_expenses}</p>
          <p>Profit: {kpis.profit}</p>
          <p>Profit Margin: {kpis.profit_margin}</p>
          <p>Forecast Revenue Next Month: {forecast}</p>
        </div>
      )}
    </div>
  );
}

export default App;
