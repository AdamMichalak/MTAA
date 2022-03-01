import sipfullproxy as sip
import time
    
sip.logging.basicConfig(format='%(asctime)s:%(levelname)s:%(message)s',
                        datefmt='%H:%M:%S',
                        filename='proxy.log',
                        level=sip.logging.INFO)
sip.logging.info(time.strftime("%a, %d %b %Y %H:%M:%S ", time.localtime()))

hostname = sip.socket.gethostname()
sip.logging.info(hostname)
ipaddress = sip.socket.gethostbyname(hostname)
if ipaddress == "127.0.0.1":
    ipaddress = sip.sys.argv[1]

sip.logging.info(ipaddress)
sip.recordroute = "Record-Route: <sip:%s:%d;lr>" % (ipaddress, sip.PORT)
sip.topvia = "Via: SIP/2.0/UDP %s:%d" % (ipaddress, sip.PORT)

server = sip.socketserver.UDPServer((sip.HOST, sip.PORT), sip.UDPHandler)

print(f'HOST: {hostname}')
print(f'IP ADDRESS: {ipaddress}')
print(f'PORT: {sip.PORT}')
print(sip.topvia)

server.serve_forever()
