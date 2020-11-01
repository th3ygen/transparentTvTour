import time
import serial
import json
import numpy
import paho.mqtt.client as mqtt
from datetime import datetime
from haversine import haversine, Unit

mqttc = mqtt.Client(transport='websockets')
mqttc.connect('localhost', 9001)

commands = [
#     b'at!entercnd=\"A710\"\r',
#     b'at!custom=\"gpsenable\",1\r',
#     b'at!custom=\"gpssel\",0\r',
#     b'at!reset\r',
#     b'at!gpsautostart=1,1,100,10,10\r',
#     b'at!gpssatinfo?\r',
    b'at!gpsloc?\r'
]

pins = []

dev = serial.Serial("/dev/ttyUSB2", 115200, timeout=0)
dev.flushInput() 

def latlon(raw):
    return round((float(raw[0]) + float(raw[2])/60 + float(raw[4])/(60*60)) * (-1 if raw[6] in ['W', 'S'] else 1), 7)

def dateTime():
    now = datetime.now()
    return now.strftime("%H:%M:%S")

def skipLines(dev):
    raw = dev.readline()
    res = raw.decode('utf-8').strip('\r\n')
    if "Lat:" in res or "Lon:" in res:        
        return res.strip("Lat: ").rsplit(' ',1)[0].split(" ")
    else:
        return skipLines(dev)

for cmd in commands:
    print("Command: ",cmd)
    dev.write(cmd)
    if cmd == b'at!reset\r':
        print("yep")
        time.sleep(15)
        
        
with open('/home/pi/transparentTvTour/pins.json') as f:
    data = json.load(f)
    
pins = data['pins']


for x in range(len(pins)):
    pins[x]['check'] = False
    
while True:
    raw_lat = (skipLines(dev))
    raw = dev.readline()
    res = raw.decode('utf-8').strip('\r\n').rsplit(' ',1)[0]
    if "Lon:" in res:
        raw_lon = res.strip("Lon: ").split(" ")
        lat = latlon(raw_lat)        
        lon = latlon(raw_lon)
        
        data = json.dumps({
            'time': dateTime(),
            'Lat': lat,
            'Lon': lon           
        })
                
        print(data)
      
        # apply haversine to all pins while checking venue radius
        for x in range(len(pins)):
            pin = pins[x]
            dist = haversine((lat, lon), (float(pin['coords']['lat']), float(pin['coords']['lon'])), unit=Unit.METERS)
            if dist < pin['radius'] and not pin['check']:
                # trigger once
                mqttc.publish('loc-trigger', pin['label'])
                
                for y in range(len(pins)):pins[y]['check'] = False
                pin['check'] = True

    dev.write(b'at!gpsloc?\r')
    time.sleep(1)

