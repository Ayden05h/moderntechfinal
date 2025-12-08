from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import pandas as pd
from sklearn.linear_model import LinearRegression
import io
import csv

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))

        # Validate required columns
        required_columns = ["revenue", "expenses"]
        for col in required_columns:
            if col not in df.columns:
                return {"error": f"CSV missing required column: {col}"}

        # Ensure numeric
        df["revenue"] = pd.to_numeric(df["revenue"], errors="coerce")
        df["expenses"] = pd.to_numeric(df["expenses"], errors="coerce")
        df = df.dropna(subset=["revenue", "expenses"])

        # Ensure month exists
        if "month" not in df.columns:
            df["month"] = [f"Month {i+1}" for i in range(len(df))]

        # KPIs
        total_revenue = df["revenue"].sum()
        total_expenses = df["expenses"].sum()
        profit = total_revenue - total_expenses
        profit_margin = profit / total_revenue if total_revenue else 0

        # Revenue forecast
        df["month_index"] = range(len(df))
        model_rev = LinearRegression()
        model_rev.fit(df[["month_index"]], df["revenue"])
        next_month_revenue = model_rev.predict([[len(df)]])

        # Expenses forecast
        model_exp = LinearRegression()
        model_exp.fit(df[["month_index"]], df["expenses"])
        next_month_expense = model_exp.predict([[len(df)]])

        return {
            "preview": df.head().to_dict(orient="records"),
            "kpis": {
                "total_revenue": float(total_revenue),
                "total_expenses": float(total_expenses),
                "profit": float(profit),
                "profit_margin": round(profit_margin, 2),
            },
            "forecast": float(next_month_revenue[0]),
            "forecast_expenses": float(next_month_expense[0]),
        }
    except Exception as e:
        return {"error": f"Failed to process CSV: {str(e)}"}


@app.get("/download-kpis")
async def download_kpis():
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["KPI", "Value"])
    writer.writerow(["Total Revenue", 0])
    writer.writerow(["Total Expenses", 0])
    writer.writerow(["Profit", 0])
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=kpis.csv"},
    )
