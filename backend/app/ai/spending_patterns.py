from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def detect_spending_patterns(df):
    """
    Returns cluster summary instead of raw clusters
    """

    if df.empty or len(df) < 5:
        return {"message": "Not enough data for pattern detection"}

    features = df[["amount", "day_of_week", "month"]]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(features)

    kmeans = KMeans(n_clusters=3, random_state=42, n_init="auto")
    df = df.copy()
    df["cluster"] = kmeans.fit_predict(X_scaled)

    summary = []

    for cluster_id in sorted(df["cluster"].unique()):
        cluster_df = df[df["cluster"] == cluster_id]

        summary.append({
            "cluster": int(cluster_id),
            "avg_amount": round(float(cluster_df["amount"].mean()), 2),
            "top_category": str(cluster_df["category"].mode()[0]),
            "top_payment_method": str(cluster_df["payment_method"].mode()[0]),
            "common_day": int(cluster_df["day_of_week"].mode()[0]),
            "transactions": int(len(cluster_df))
        })

    return {"patterns": summary}
