import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; 

// Initialize connection lazily with auto-connect disabled initially
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true
});