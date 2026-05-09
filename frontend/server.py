from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/api/hazard', methods=['POST'])
def receive_ai_hazard():
    data = request.json
    print(f"\n👁️ VISION AI DETECTED: {data['hazard']}")
    socketio.emit('ai_hazard_detected', data)
    return jsonify({"status": "Alert broadcasted"}), 200

@socketio.on('new_alert')
def handle_deployment(data):
    # This triggers when you click 'Deploy' in React
    print(f"\n🚨 DISPATCHING: {data['service_name']} to {data['location']}")
    emit('new_alert', data, broadcast=True)

if __name__ == '__main__':
    # host='0.0.0.0' allows Laptop 2 to connect via your WiFi
   if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5002, debug=True)