function ForecastCard({ forecast, yearly, breakEven }) {
  return (
    <div style={{
      padding: "20px",
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 0 5px rgba(0,0,0,0.1)",
      marginTop: "20px"
    }}>
      <h3>Next Month Forecast</h3>
      <p>${forecast.toLocaleString()}</p>

      <h3>Yearly Projection</h3>
      <p>${yearly.toLocaleString()}</p>

      <h3>Break-even Point</h3>
      <p>{breakEven === -1 ? "No break-even reached" : `${breakEven} months`}</p>
    </div>
  );
}

export default ForecastCard;
