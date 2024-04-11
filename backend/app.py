from flask import Flask
import os
from flask_cors import CORS  # Import the CORS module
import sys
sys.path.append('routes')
sys.path.append('routes/stats')

os.makedirs('.\static', exist_ok=True)
app = Flask(__name__)
CORS(app)
from routes.csv import csv_route


app.register_blueprint(csv_route)

if __name__ == '__main__':
    app.run(debug=True, port=4000, host='0.0.0.0')
