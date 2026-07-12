import env from 'dotenv';
env.config();
import http from 'http';
import app from './src/app.js';
import db from './src/config/db.js';
// Importing associations also imports all models, registering them with sequelize
import setupAssociations from './src/config/associations.js';
import { setupSocket } from './src/config/socket.js';

const port = process.env.PORT || 3000;

// Create HTTP server and attach Socket.IO
const httpServer = http.createServer(app);
setupSocket(httpServer);

// Set up Sequelize associations (must be called before sync)
setupAssociations();

// Sync all models & start server
(async () => {
  try {
    // Disable FK checks during sync to avoid constraint errors with existing data
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.sequelize.sync();
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log(' All models synced successfully.');

    await db.dbConnection();

    httpServer.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('❌ Failed to sync models:', err);
  }
})();