import pandas as pd

def prepare_transaction_dataframe(transactions):
    """
    transactions: list of SQLAlchemy Transaction objects
    """

    data = [{
        "amount": float(tx.amount),
        "category": str(tx.category.name),
        "category_type": str(tx.category.type),
        "payment_method": str(tx.payment_method),
        "date": tx.transaction_date,
        "day_of_week": int(tx.transaction_date.weekday()),
        "month": int(tx.transaction_date.month)
    } for tx in transactions]

    df = pd.DataFrame(data)

    # only expenses for AI analysis
    df = df[df["category_type"] == "expense"]

    return df
