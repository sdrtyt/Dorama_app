from flask import Flask, jsonify
import requests

app = Flask(__name__)

# Эндпоинт для получения данных о дорамах
@app.route('/api/doramas', methods=['GET'])
def get_doramas():
    api_url = "https://mydramalist.com/api/v2/dramas"
    params = {
        "status": "upcoming",
        "limit": 20,
        "page": 1
    }

    response = requests.get(api_url, params=params)
    if response.status_code == 200:
        return jsonify(response.json())  # Возвращаем данные как JSON
    else:
        return jsonify({"error": "Ошибка при получении данных"}), response.status_code

if __name__ == "__main__":
    app.run(debug=True)