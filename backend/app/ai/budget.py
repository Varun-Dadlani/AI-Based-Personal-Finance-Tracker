from datetime import date

def generate_budget_recommendations(df):
    """
    Generate budget advice per category
    """

    if df.empty or len(df) < 10:
        return {"message": "Not enough data for budget analysis"}

    df = df.copy()
    df["month"] = df["date"].apply(lambda d: int(d.month))
    current_month = date.today().month

    recommendations = []

    for category in df["category"].unique():
        cat_df = df[df["category"] == category]

        prev_months = cat_df[cat_df["month"] < current_month].tail(3)
        current = cat_df[cat_df["month"] == current_month]

        if prev_months.empty or current.empty:
            continue

        avg_spend = float(prev_months["amount"].mean())
        allowed_budget = avg_spend * 1.1
        current_spend = float(current["amount"].sum())

        if current_spend > allowed_budget:
            recommendations.append({
                "category": str(category),
                "current_spend": round(current_spend, 2),
                "recommended_budget": round(allowed_budget, 2),
                "suggestion": f"Reduce spending on {category}"
            })

    return {"budgets": recommendations}
