from flask import Flask
import os
from flask_cors import CORS  # Import the CORS module

os.makedirs('.\static', exist_ok=True)
app = Flask(__name__)
CORS(app)
from routes.csv import csv

app.register_blueprint(csv)

if __name__ == '__main__':
    app.run(debug=True, port=4000)
