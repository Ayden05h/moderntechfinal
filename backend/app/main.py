from fastapi import FastAPI, UploadFile, File
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from sklearn.linear_model import LinearRegression
import io

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
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))

    # Calculate KPIs
    total_revenue = df["revenue"].sum()
    total_expenses = df["expenses"].sum()
    profit = total_revenue - total_expenses

    # Simple trend prediction
    df["month_index"] = range(len(df))
    model = LinearRegression()
    model.fit(df[["month_index"]], df["revenue"])
    next_month_prediction = model.predict([[len(df)]])

    return {
        "preview": df.head().to_dict(orient="records"),
        "kpis": {
            "total_revenue": float(total_revenue),
            "total_expenses": float(total_expenses),
            "profit": float(profit),
        },
        "forecast": float(next_month_prediction[0]),
    }
