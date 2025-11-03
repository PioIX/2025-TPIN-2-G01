import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
// localhost:4000

const useSocket = (
  options = { withCredentials: false },
  serverUrl = "ws://localhost:4000/"
) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketIo = io(serverUrl, options);

    socketIo.on('connect', () => {
      setIsConnected(true);
      console.log('WebSocket connected.');
    });

    socketIo.on('disconnect', () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
      setSocket(null); 
    };
  }, [serverUrl, JSON.stringify(options)]);

  return { socket, isConnected };
};

export { useSocket };
