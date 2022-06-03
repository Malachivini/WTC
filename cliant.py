#from enum import Flag
from multiprocessing.connection import wait
import serial.tools.list_ports
import time
import json
import socket


HOST = "10.176.95.26"
PORT = 5005
s  = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

  
ports= serial.tools.list_ports.comports()
my_id=1
def unoccupied(ard,my_id):
    
    while(True):    
        ard_date= ard.readline()
        decoded_ard= str(ard_date[0:len(ard_date)].decode("utf-8"))
        print(decoded_ard)
        time.sleep(1/2)
        if int(decoded_ard) < 50 and not int(decoded_ard)==0:
            time.sleep(3)
            ard_date= ard.readline()
            decoded_ard= str(ard_date[0:len(ard_date)].decode("utf-8"))
            if int(decoded_ard) < 50 and not int(decoded_ard)==0:
                print("Switch")
                time.sleep(2)
                UpdateData(ard,my_id,0)
               # s.sendfile()
                occupied(ard,my_id)
def occupied(ard,my_id):

    while(True):    
        ard_date= ard.readline()
        decoded_ard= str(ard_date[0:len(ard_date)].decode("utf-8"))
        time.sleep(1/2)
        print(decoded_ard)
        if int(decoded_ard) > 50 and not int(decoded_ard)==0:
            time.sleep(3)
            ard_date= ard.readline()
            decoded_ard= str(ard_date[0:len(ard_date)].decode("utf-8"))
            if int(decoded_ard) > 50 and not int(decoded_ard)==0:
                print("Swich")
                time.sleep(2)
                UpdateData(ard,my_id,1)
                unoccupied(ard,my_id)



def UpdateData(ard,my_id,ava):
    if ava==1:
        x={
            "type":"Feature",
            "properties":{
                "name":"Bar Ilan",
                "available":1
            },
            "geometry":{
                "type":"Point",
                "coordinates":[34.846046,32.073452]
            }
            
        }
    if ava==0:
        x={
            "type":"Feature",
            "properties":{
                "name":"Bar Ilan",
                "available":0
            },
            "geometry":{
                "type":"Point",
                "coordinates":[34.846046,32.073452]
            }
        }
   # print("test")
    #s.connect((HOST, PORT))
   # s.sendall(b(x))
    #print("test")
    final_dictionary = eval(str((x)))
    jsonfile=json.dumps(final_dictionary)

    print ("type of final_dictionary", type(final_dictionary))
    js=open("HACKATHONJSON.json","w")
    json.dump(final_dictionary, js, indent = 4, sort_keys = False)
    js.close()
    f=open("FileNameHACKATHON.txt","w") 
    f.write(str(x))
    f.close()
    print(x)
ard = serial.Serial('COM7',9600)
unoccupied(ard,my_id)
   