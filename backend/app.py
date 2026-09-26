from flask import Flask
from flask_cors import CORS

from routes.prediction import prediction_bp

app = Flask(__name__)
CORS(app)

# Register Routes
app.register_blueprint(prediction_bp)

@app.route('/')
def home():
    return "ISL NMF Backend Running"

if __name__ == '__main__':
    app.run(debug=True)