#!/usr/bin/env python

#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements. See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership. The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License. You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied. See the License for the
# specific language governing permissions and limitations
# under the License.
#

import glob
import sys
sys.path.append('gen-py')
sys.path.insert(0, glob.glob('/home/yaoliu/src_code/local/lib/lib/python2.7/site-packages')[0])

from chord import FileStore
from chord.ttypes import InvalidOperation, Operation, RFileMetadata, RFile, NodeID

from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer

#hashlib to convert string to SHA256
import hashlib
import socket


class FileStoreHandler:
    def __init__(self, ip, port):
        self.log = {}
        self.files = {}
        self.fingertable = []
        self.node = NodeID()
        self.nodeid_obj.id = hashlib.sha256(str(ip)+":"+str(port)).hexdigest()
        self.nodeid_obj.ip = ip
        self.nodeid_obj.port = port
        
        

    def writeFile(self, rFile):
        filename = rFile.meta.filename
        file_id = hashlib.sha256(filename).hexdigest()

        if file_id in self.files:
            self.files[file_id].content = rFile.content
            self.files[file_id].meta.contentHash = rFile.meta.contentHash
            self.files[file_id].meta.version += 1
        else:
            #we want to add it to our files dictionary
            rFile.meta.version = 0
            self.files[file_id] = rFile
            

    def readFile(self, filename):
        file_id = hashlib.sha256(filename).hexdigest()
        if file_id in self.files:
            return self.files[file_id]
        else:
            raise SystemException("File {} not found.".format(filename))

    def setFingertable(self, node_list):
        """
        Parameters:
         - node_list
        """
        pass

    def findSucc(self, key):
        """
        Parameters:
         - key
        """
        pass

    def findPred(self, key):
        """
        Parameters:
         - key
        """
        pass

    def getNodeSucc(self):
        pass

if __name__ == '__main__':
    ip_add = socket.gethostname()
    handler = FileStoreHandler(ip_add, int(sys.argv[1]))
    processor = FileStore.Processor(handler)
    transport = TSocket.TServerSocket(port=int(sys.argv[1]))
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

    server = TServer.TSimpleServer(processor, transport, tfactory, pfactory)

    print('Starting the server...')
    server.serve()
    print('done.')
