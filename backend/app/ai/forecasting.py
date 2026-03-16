from sklearn.linear_model import LinearRegression
import numpy as np

def forecast_next_month(df):
    """
    Forecast next month's total expense.
    """

    if df.empty or len(df) < 6:
        return {"message": "Not enough data for forecasting"}

    monthly = (
        df.groupby("month")["amount"]
        .sum()
        .reset_index()
        .sort_values("month")
    )

    X = monthly["month"].astype(int).values.reshape(-1, 1)
    y = monthly["amount"].astype(float).values

    model = LinearRegression()
    model.fit(X, y)

    next_month = int(monthly["month"].max() + 1)
    prediction = float(model.predict([[next_month]])[0])

    return {
        "next_month": next_month,
        "predicted_amount": round(prediction, 2)
    }
