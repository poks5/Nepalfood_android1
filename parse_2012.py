import pandas as pd
import json

df = pd.read_excel('public/Nepal_Food_composition_Database_2012.xlsx')

# Identify columns. We need to map them to the 2024 schema where possible.
print(df.columns.tolist())
print(df.head(5))

