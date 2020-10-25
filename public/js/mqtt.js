const mqttClient = mqtt.connect('ws://localhost:9001');

mqttClient.on('connect', () => {
    mqttClient.subscribe('loc-trigger');
});