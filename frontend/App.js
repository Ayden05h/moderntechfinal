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
  const [chartData, setChartData] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

   const res = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

    setPreview(res.data.preview);
    setKpis(res.data.kpis);
    setForecast(res.data.forecast);

    // Build chart
    const months = res.data.preview.map((_, i) => `Month ${i + 1}`);
    const revenues = res.data.preview.map((row) => row.revenue);

    setChartData({
      labels: months,
      datasets: [
        {
          label: "Revenue",
          data: revenues,
        },
      ],
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Business Data Dashboard</h1>

      <input type="file" onChange={handleUpload} />

      <hr />

      {kpis && (
        <div>
          <h2>KPIs</h2>
          <p><strong>Total Revenue:</strong> ${kpis.total_revenue}</p>
          <p><strong>Total Expenses:</strong> ${kpis.total_expenses}</p>
          <p><strong>Profit:</strong> ${kpis.profit}</p>

          <h3>Next Month Revenue Prediction: ${forecast}</h3>
        </div>
      )}

      <hr />

      {chartData && (
        <div style={{ width: "500px" }}>
          <h2>Revenue Chart</h2>
          <Line data={chartData} />
        </div>
      )}

      <hr />

      {preview.length > 0 && (
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
