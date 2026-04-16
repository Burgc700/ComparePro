'''
Was having an issue connecting the api to the database so this is just some debug code to figure out what the problem was.
'''
import pyodbc

print("Available ODBC Drivers:")
for driver in pyodbc.drivers():
    print(f"  - {driver}")