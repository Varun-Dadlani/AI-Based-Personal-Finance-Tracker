import ollama

SYSTEM_PROMPT = """
You are a financial assistant.
Explain insights ONLY using the provided data.
Do not invent numbers.
Do not give financial advice beyond the data.
"""

def explain_insight(data, question):
    response = ollama.chat(
        model="llama3.1:8b",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"""
DATA:
{data}

QUESTION:
{question}
"""
            }
        ]
    )

    return response["message"]["content"]
