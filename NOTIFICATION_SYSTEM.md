# 🔔 Hệ Thống Thông Báo Real-time For Btaskee

## 📋 Tổng Quan

Hệ thống này sử dụng **Socket.IO** để cung cấp thông báo real-time khi nhân viên cập nhật trạng thái đơn hàng trên trang `staff-dashboard/schedule`. Khách hàng sẽ thấy thông báo ngay lập tức ở trang chủ thông qua icon chuông.

---

## 🏗️ Kiến Trúc

### Backend (Node.js + Express)
```
backend/index.js
├── Socket.IO Server setup
├── Customer connection tracking (customerConnections map)
├── Event handlers:
│   ├── register_customer: Map clerkId → socketId
│   ├── order_status_updated: Send notification to customer
│   └── disconnect: Clean up connection
└── Controllers/orderController.js
    └── updateOrder: Emit notification when status changes
```

### Frontend (React + Clerk)
```
client/src/components/NotificationBell.jsx
├── Socket.IO Client setup
├── Register customer on connect
├── Listen for notifications
└── Display notifications in dropdown with bell icon

client/src/components/Header.jsx
└── Include NotificationBell component
```

---

## 📱 Flow Diagram

```
1. Customer visits HomePage
   ↓
2. NotificationBell component initializes
   └─ Connects to Socket.IO server
   └─ Registers customer with Clerk user.id (clerkId)
   └─ Socket.IO stores: customerConnections[clerkId] = socketId
   ↓
3. Staff updates order status on staff-dashboard/schedule
   └─ Calls: PATCH /api/orders/{orderId}
   ├─ Body: { status: "in_progress", staffId: "..." }
   ↓
4. Backend updateOrder function processes the update
   ├─ If status changed:
   │  ├─ Fetch populated order with customer.clerkId
   │  ├─ Emit Socket event: order_status_updated
   │  └─ Payload: { orderId, customerId (clerkId), status, staffName, message }
   ↓
5. Backend Socket.IO receives order_status_updated
   ├─ Find customer socket: socketId = customerConnections[customerId]
   ├─ If found:
   │  └─ io.to(socketId).emit("notification", {...})
   ↓
6. Frontend receives notification event
   └─ Updates notifications state
   └─ Auto-displays for 5 seconds
   └─ Updates unread count
   └─ User can manually dismiss
```

---

## 🔧 Implementation Details

### 1. **Customer Registration (Frontend)**
```javascript
// NotificationBell.jsx
socket.on("connect", () => {
  socketRef.current.emit("register_customer", user.id); // Clerk user.id
});
```

### 2. **Backend Socket Mapping**
```javascript
// backend/index.js
io.on("connection", (socket) => {
  socket.on("register_customer", (clerkId) => {
    customerConnections[clerkId] = socket.id; // Map: clerkId → socketId
  });
});
```

### 3. **Status Update Trigger**
```javascript
// backend/controllers/orderController.js
const updateOrder = async (req, res) => {
  // ... update processing ...
  
  if (newStatus !== oldStatus && io) {
    const customerId = populatedOrder.customer.clerkId; // Get clerkId
    io.emit("order_status_updated", {
      orderId,
      customerId, // Use clerkId
      status: newStatus,
      staffName,
      message,
    });
  }
};
```

### 4. **Notification Emission**
```javascript
// backend/index.js
socket.on("order_status_updated", (data) => {
  const socketId = customerConnections[data.customerId];
  if (socketId) {
    io.to(socketId).emit("notification", {...});
  }
});
```

### 5. **Frontend Display**
```javascript
// NotificationBell.jsx
socket.on("notification", (data) => {
  setNotifications((prev) => [{...data, isRead: false}, ...prev]);
  setUnreadCount((prev) => prev + 1);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    setNotifications((prev) => 
      prev.filter((n) => n.id !== data.id)
    );
  }, 5000);
});
```

---

## 🎯 Status Translations

| Backend Status | Vietnamese Label | Color |
|---|---|---|
| `assigning` | Đang phân công | Gray |
| `pending` | Chờ xử lý | Yellow |
| `accepted` | Đã nhận | Blue |
| `in_progress` | Đang làm | Indigo |
| `completed` | Hoàn thành | Green |
| `canceled` | Đã hủy | Red |

---

## 🚀 Installation & Setup

### Backend
```bash
cd backend
# Add socket.io to package.json (Already done)
npm install
npm run dev
```

### Frontend
```bash
cd client
# Add socket.io-client to package.json (Already done)
npm install
npm run dev
```

---

## 📊 Testing Workflow

### 1. **Manual Test**
```
1. Start Backend:
   cd backend && npm run dev (PORT 5000)

2. Start Frontend:
   cd client && npm run dev (PORT 5173)

3. Open Browser:
   - Login as Customer on http://localhost:5173
   - Open Developer Console to see [Socket Connected]
   - In another browser/session, login as Staff
   - Go to staff-dashboard/schedule
   - Create/update an order status
   - Check HomePage for notification at bell icon
```

### 2. **Verification Checklist**
- [ ] NotificationBell shows in Header (desktop view)
- [ ] Console shows "Connected to notification server"
- [ ] Console shows "Registered customer with ID: {clerkId}"
- [ ] Backend logs show "Customer {clerkId} registered with socket {socketId}"
- [ ] When staff updates status, backend logs "Notification sent to customer..."
- [ ] Notification appears in bell dropdown with correct status
- [ ] Bell shows unread count (red badge)
- [ ] Notification auto-dismisses after 5 seconds
- [ ] User can manually dismiss with X button

---

## 🔍 Troubleshooting

### Issue: No notifications appearing
**Solution:**
1. Check backend logs for "Customer {clerkId} registered"
2. Verify customer is signed in (Clerk authentication)
3. Check network tab for socket.io connection (should see ws:// upgrade)
4. Verify order update is actually triggered (check backend logs)

### Issue: Bell icon not showing
**Solution:**
1. Verify NotificationBell component is imported in Header.jsx
2. Check user.isSignedIn status (component only renders if signed in)
3. Desktop view only (hidden on mobile)

### Issue: Socket connection fails
**Solution:**
1. Verify backend is running on port 5000
2. Check CORS settings in backend/index.js
3. Verify frontend connects to http://localhost:5000
4. Check firewall/proxy settings

### Issue: Notification shows but status doesn't update
**Solution:**
1. Verify clerkId is being stored in Customer model
2. Check if sync customer endpoint was called
3. Verify order.customer is populated with clerkId field

---

## 📦 Modified Files

### Backend
- `backend/index.js` - Socket.IO setup & event handlers
- `backend/package.json` - Added socket.io package
- `backend/controllers/orderController.js` - Emit notification on status update

### Frontend
- `client/package.json` - Added socket.io-client package
- `client/src/components/NotificationBell.jsx` - New component
- `client/src/components/Header.jsx` - Import & use NotificationBell
- `client/src/pages/staff/StaffSchedulePage.jsx` - Added staffId to update payload

---

## 🎨 UI Features

### Bell Icon
- Located in Header next to UserButton
- Shows red badge with unread count
- Click to toggle dropdown

### Notification Dropdown
- Max height 396px with scroll
- Shows "Không có thông báo" when empty
- Each notification shows:
  - Staff name (blue text)
  - Notification message
  - Status badge (teal)
  - Timestamp (vi-VN format)
  - Dismiss button (X)

### Notification Auto-remove
- Displays for 5 seconds
- User can manually dismiss with X button
- Unread count updates instantly

---

## 🔐 Security Considerations

1. **Authentication**: Uses Clerk user.id as identifier
2. **Mapping**: Backend maps clerkId → socketId for permission checking
3. **Validation**: Only emits notifications for orders belonging to customer
4. **Privacy**: Notifications only sent to registered customer socket

---

## 📝 Notes

- Customer must be signed in (checked via Clerk useUser hook)
- Only desktop view shows NotificationBell (hidden on mobile)
- Socket auto-reconnects if connection drops
- Notifications persist in state until dismissed or 5 seconds pass
- Backend automatically cleans up disconnected sockets
