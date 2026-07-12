import { Server } from 'socket.io';

let io;

/**
 * Initialize Socket.IO with the HTTP server
 * @param {import('http').Server} httpServer
 */
export function setupSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    },
  });

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });

  return io;
}

/**
 * Get the Socket.IO instance (call after setupSocket)
 * @returns {Server}
 */
export function getIO() {
  if (!io) {
    throw new Error('Socket.IO not initialized — call setupSocket() first');
  }
  return io;
}
