const socketIO = require("socket.io");

let io = null;

// Store active customer connections
const customerConnections = {};

// Initialize Socket.IO
const initSocketIO = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  // Socket.IO Events
  io.on("connection", (socket) => {
    console.log("🔗 New client connected:", socket.id);

    // Customer registers their connection with clerkId (Clerk user ID)
    socket.on("register_customer", (clerkId) => {
      customerConnections[clerkId] = socket.id;
      console.log(`✅ Customer ${clerkId} registered with socket ${socket.id}`);
      console.log(`📊 Active connections:`, Object.keys(customerConnections));
    });

    // Disconnect handler
    socket.on("disconnect", () => {
      // Find and remove customer connection
      for (let customerId in customerConnections) {
        if (customerConnections[customerId] === socket.id) {
          delete customerConnections[customerId];
          console.log(`❌ Customer ${customerId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

// Get Socket.IO instance
const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized. Call initSocketIO first.");
  }
  return io;
};

// Get customer socket ID
const getCustomerSocketId = (customerId) => {
  return customerConnections[customerId] || null;
};

// Send notification to customer
const sendNotificationToCustomer = (customerId, notificationData) => {
  const socketId = customerConnections[customerId];
  
  if (socketId && io) {
    io.to(socketId).emit("notification", {
      ...notificationData,
      timestamp: new Date(),
    });
    console.log(`✉️ Notification sent to customer ${customerId} (socket: ${socketId})`);
    return true;
  } else {
    console.log(`⚠️ Customer ${customerId} not connected (socket not found)`);
    return false;
  }
};

module.exports = { initSocketIO, getIO, getCustomerSocketId, sendNotificationToCustomer, customerConnections };
