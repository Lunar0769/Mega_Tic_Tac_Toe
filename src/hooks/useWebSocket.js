import { useEffect, useRef } from 'react';

export function useWebSocket(url, onMessage) {
  const socketRef = useRef(null);

  useEffect(() => {
    // Open WebSocket connection when the component mounts
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      // Parse incoming messages and pass to handler
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Clean up on unmount
    return () => {
      socket.close();
    };
  }, [url, onMessage]);

  // send(): helper to send a JSON message if socket is open
  const send = (messageObj) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(messageObj));
    }
  };

  return { send };
}