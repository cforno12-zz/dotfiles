import socket
from threading import Thread, Lock
from datetime import datetime
import os
import magic
from wsgiref.handlers import format_date_time
from time import mktime
import queue
import sys

HOST = socket.gethostbyname(socket.gethostname())
PORT = 0              # Arbitrary non-privileged port
ACCESS_DISK_LOCK = Lock()
FILE_DICT = dict()
mutex = Lock()

def create_TCP_socket():
    # create an INET, STREAMing socket
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # bind this socket to a port
    server_socket.bind((HOST, 0))

    #listen for X amount of connection
    server_socket.listen(5)

    return server_socket


def retrieve_source(resource, clientadd):
    og_resource = resource
    resource = resource.strip()
    content = None
    file_array = resource.split('/')
    if file_array[1] == "www":
        resource = "." + resource
        times_called = FILE_DICT.get(og_resource)
        print (resource , "|" , clientadd[0] ,"|", clientadd[1], "|", times_called, sep='')
        with open(resource, 'r') as current_file:
            content = current_file.read()
    else:
        return None

    return content

def get_curr_date():
    now = datetime.now()
    stamp = mktime(now.timetuple())
    return format_date_time(stamp)

def modified_date_of_file(filename):
    stamp = os.path.getmtime(filename)
    date = datetime.fromtimestamp(stamp)
    return format_date_time(mktime(date.timetuple()))

def get_size_of_file(filename):
    return str(os.path.getsize(filename))

def header_response_200(http_version, resource_path):
    response = ""
    # append http verison and 200 response
    response += (http_version + " 200 OK\r\n" )
    # add date and time
    date_str = get_curr_date()
    response += (date_str + "\r\n")
    # server name
    response += "Server: Forno/1.0 (Darwin)\r\n"
    # time last modified path
    resource_path = "." + resource_path.strip() # we want the current directory
    response += modified_date_of_file(resource_path)
    response += "\r\n"
    # get MIME type
    mime = magic.Magic(mime=True)
    response += "Content-Type: " + mime.from_file(resource_path) + "\r\n"
    # get file size
    response += "Content-Length: " + get_size_of_file(resource_path) + "\r\n"
    return response

def get_bytes_response_200(http_version, resource, clientadd):
    response = header_response_200(http_version, resource)
    # blank line
    response += "\r\n"
    file_content = retrieve_source(resource, clientadd)
    if file_content == None:
        return get_bytes_response_404(http_version)
    response += file_content

    #convert string to bytes
    bytes_response = str.encode(response)

    return bytes_response

# 400 bad request
def get_bytes_response_400():
    response = ""
    # just 400 status code
    response += "400 Bad Request Error\r\n"
    response += get_curr_date() + "\r\n"
    return str.encode(response)

def does_file_exist(filepath):
    if filepath.startswith("."):
        return os.path.isfile(filepath)
    else:
        filepath = "." + filepath
        return os.path.isfile(filepath)

def get_bytes_response_404(http_version):
    response = ""
    response += http_version + " 404 Not Found\r\n"
    response += "\n"
    return str.encode(response)

def get_response(client_socket, clientadd):
    request = client_socket.recv(4096)
    request_str = request.decode("utf-8")
    request_array = request_str.splitlines()
    return_value = None

    # we only want the first line of the request
    if len(request_array[0].split()) != 3:
        return_value = get_bytes_response_400("HTTP/1.1")

    command, resource, http_version = request_array[0].split()

    mutex.acquire()
    try:
        if resource in FILE_DICT:
            FILE_DICT[resource] += 1
        else:
            FILE_DICT.update({resource : 1})
    finally:
        mutex.release()

    if command == "GET":
        #check if the file exists
        if does_file_exist(resource):
            return_value =  get_bytes_response_200(http_version, resource, clientadd)
        else:
            return_value =  get_bytes_response_404(http_version)
            #send 404 not found
    else:
        return_value =  get_bytes_response_400(http_verison)

    print("Sending this response....")
    print(str(return_value, 'utf-8'))
    client_socket.sendall(return_value)


if __name__ == "__main__":

    threads = []
    server_socket = create_TCP_socket()

    PORT = server_socket.getsockname()[1]

    print ("Server is running on ", HOST, ":", PORT, sep='')

    while True:
        try:
            client_socket, clientadd = server_socket.accept()
            t = Thread(target = get_response, args = (client_socket, clientadd))
            threads.append(t)
            t.start()
        except KeyboardInterrupt:
            server_socket.close()
            print("Closing socket...")
            sys.exit(0)

    for t in threads:
        t.join()

    server_socket.close()
