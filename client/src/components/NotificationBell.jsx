import React, { useEffect, useState, useRef } from "react";
import { Bell, X } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import io from "socket.io-client";

export default function NotificationBell() {
  const { user, isSignedIn } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isSignedIn || !user) return;

    // Connect to Socket.IO
    socketRef.current = io("http://localhost:5000", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Register customer after connection
    socketRef.current.on("connect", () => {
      console.log("✅ Connected to notification server");
      // Use Clerk user.id as the customer identifier
      socketRef.current.emit("register_customer", user.id);
      console.log(`📝 Registered customer with ID: ${user.id}`);
    });

    // Listen for notifications
    socketRef.current.on("notification", (data) => {
      console.log("🔔 Notification received:", data);
      setNotifications((prev) => [
        { ...data, id: Date.now(), isRead: false },
        ...prev,
      ]);
      setUnreadCount((prev) => prev + 1);

      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== data.id)
        );
      }, 5000);
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ Disconnected from notification server");
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("❌ Connection error:", error);
    });

    socketRef.current.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isSignedIn, user]);

  const handleNotificationClick = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notifId ? { ...n, isRead: true } : n
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleDismiss = (notifId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showDropdown]);

  if (!isSignedIn) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-700 hover:text-teal-600 transition-colors"
        title="Thông báo"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1 -translate-y-1 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-orange-50 p-4">
            <h3 className="font-bold text-gray-800">Thông báo của bạn</h3>
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Không có thông báo</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    notif.isRead ? "bg-white" : "bg-blue-50"
                  }`}
                  onClick={() => handleNotificationClick(notif.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-teal-600">
                          {notif.staffName || "Thông báo"}
                        </span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mt-1">
                        {notif.message}
                      </p>
                      {notif.scheduledAt && (
                        <p className="text-xs text-gray-600 mt-2 font-medium">
                          📅 {new Date(notif.scheduledAt).toLocaleString("vi-VN")}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Thông báo lúc: {new Date(notif.timestamp).toLocaleTimeString("vi-VN")}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss(notif.id);
                      }}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
