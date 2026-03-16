def detect_anomalies(df, threshold=2.5):
    """
    Detect unusually high expenses using Z-score.
    """

    if df.empty or len(df) < 5:
        return {"anomalies": []}

    anomalies = []

    for category in df["category"].unique():
        cat_df = df[df["category"] == category]

        mean = float(cat_df["amount"].mean())
        std = float(cat_df["amount"].std())

        if std == 0 or std is None:
            continue

        cat_df = cat_df.copy()
        cat_df["z_score"] = (cat_df["amount"] - mean) / std

        outliers = cat_df[cat_df["z_score"] > threshold]

        for _, row in outliers.iterrows():
            anomalies.append({
                "category": str(category),
                "amount": round(float(row["amount"]), 2),
                "date": row["date"].isoformat(),
                "z_score": round(float(row["z_score"]), 2),
                "reason": f"Unusually high spending in {category}"
            })

    return {"anomalies": anomalies}
