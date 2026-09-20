import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

const getNotificationItems = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.notifications)) return data.notifications;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const getUnreadCount = (data, items) => {
  const unreadCount = data?.unreadCount ?? data?.unread ?? data?.count;
  if (Number.isFinite(Number(unreadCount))) return Number(unreadCount);
  return items.filter((item) => !item.read && !item.isRead).length;
};

const formatNotificationTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const markNotificationsRead = () =>
  API.patch("/notifications/read-all");



const Navbar = ({ toggleSidebar, title = "AquaFlow Admin" }) => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoaded, setNotificationsLoaded] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");
  const menuRef = useRef(null);
  const notificationRef = useRef(null);
  const notificationOpenRef = useRef(false);

  const markLocalNotificationsRead = () => {
    setNotificationCount(0);
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
        isRead: true,
      }))
    );
  };

 const loadNotifications = useCallback(() => {
  setNotificationsLoading(true);
  setNotificationsError("");

  API.get("/notifications")
    .then((res) => {
      const items = getNotificationItems(res.data);

      setNotifications(items);

      setNotificationCount(
        getUnreadCount(res.data, items)
      );

      setNotificationsLoaded(true);
    })
    .catch((err) => {
      console.error(
        "Notification load error:",
        err?.response?.data || err?.message
      );

      setNotificationCount(0);
      setNotifications([]);
      setNotificationsError(
        "Unable to load notifications."
      );
    })
    .finally(() => {
      setNotificationsLoading(false);
    });
}, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    notificationOpenRef.current = notificationOpen;
  }, [notificationOpen]);

  useEffect(() => {
    const onClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        setNotificationOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);
const toggleNotifications = () => {
  setNotificationOpen((current) => {
    const nextOpen = !current;

    notificationOpenRef.current = nextOpen;

  if (nextOpen) {
  markLocalNotificationsRead();

  markNotificationsRead()
    .then(() => {
      // Reload after MongoDB is updated
      loadNotifications();
    })
    .catch((err) => {
      console.error(
        "Mark notifications read error:",
        err?.response?.data || err?.message
      );

      setNotificationsError(
        "Notifications opened, but could not sync read status."
      );
    });
}

    return nextOpen;
  });
};

  const displayUser = user?.user || user || {};

  return (
    <div style={styles.nav}>
      <div style={styles.left}>
        <button onClick={toggleSidebar} style={styles.menuBtn}>
          ☰
        </button>
        <div style={styles.logoMark}>AZ</div>
        <h3 style={{ margin: 0 }}>{title}</h3>
      </div>

      <div style={styles.right}>
        <div ref={notificationRef} style={{ position: "relative" }}>
          <button
            type="button"
            style={styles.iconButton}
            title="Notifications"
            aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ""}`}
            aria-expanded={notificationOpen}
            aria-haspopup="dialog"
            onClick={toggleNotifications}
          >
            <FaBell aria-hidden="true" style={styles.bell} />
            {notificationCount > 0 && <span style={styles.badge}>{notificationCount}</span>}
          </button>

          {notificationOpen && (
            <div style={styles.notificationMenu} role="dialog" aria-label="Recent notifications">
              <div style={styles.notificationHeader}>
                <div>
                  <p style={styles.notificationTitle}>Notifications</p>
                  <p style={styles.notificationMeta}>Recent activity</p>
                </div>
                <button type="button" style={styles.refreshBtn} onClick={loadNotifications}>
                  Refresh
                </button>
              </div>

              {notificationsLoading && (
                <div style={styles.notificationState}>
                  <span style={styles.spinner} />
                  Loading notifications...
                </div>
              )}

              {!notificationsLoading && notificationsError && (
                <div style={{ ...styles.notificationState, color: "#b42318" }}>
                  {notificationsError}
                </div>
              )}

              {!notificationsLoading && !notificationsError && notifications.length === 0 && (
                <div style={styles.notificationState}>No recent notifications.</div>
              )}

              {!notificationsLoading && !notificationsError && notifications.length > 0 && (
                <div style={styles.notificationList} role="list">
                  {notifications.map((notification, index) => {
                    const unread = !notification.read && !notification.isRead;
                    const key = notification._id || notification.id || index;
                    const notificationTitle =
                      notification.title || notification.subject || "Notification";
                    const message =
                      notification.message || notification.body || notification.text || "";
                    const time = formatNotificationTime(
                      notification.createdAt || notification.updatedAt || notification.date
                    );

                    return (
                      <div
  key={key}
  style={{
    ...styles.notificationItem,
    background: unread ? "#f5faff" : "#fff",
  }}
  role="listitem"
>
  <span
    style={{
      ...styles.unreadDot,
      visibility: unread ? "visible" : "hidden",
    }}
  />

  <div style={styles.notificationContent}>
    <div style={styles.notificationItemTop}>
      <p style={styles.notificationItemTitle}>
        {notificationTitle}
      </p>

      {unread && (
        <span style={styles.newBadge}>
          NEW
        </span>
      )}
    </div>

    {message && (
      <p style={styles.notificationMessage}>
        {message}
      </p>
    )}

    {time && (
      <p style={styles.notificationTime}>
        {time}
      </p>
    )}
  </div>
</div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div ref={menuRef} style={{ position: "relative" }}>
          <button style={styles.avatar} onClick={() => setOpen(!open)} title="Profile">
            {(displayUser.name || "A").slice(0, 1).toUpperCase()}
          </button>
          {open && (
            <div style={styles.menu}>
              <p style={styles.menuName}>{displayUser.name || "Admin"}</p>
              <p style={styles.menuMeta}>{displayUser.role || "Super Admin"}</p>
              <button style={styles.menuItem}>My Profile</button>
              <button style={styles.menuItem}>Settings</button>
              <button onClick={logout} style={{ ...styles.menuItem, color: "#c0392b" }}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {

  notificationItemTop: {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
},

newBadge: {
  fontSize: "9px",
  fontWeight: 800,
  color: "#146c94",
  background: "#e6f4f9",
  borderRadius: "10px",
  padding: "3px 7px",
  flexShrink: 0,
},
  nav: {
    height: "60px",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between", // 👈 important
    alignItems: "center",
    padding: "0 20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoMark: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    background: "#146c94",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
  },
  menuBtn: {
    fontSize: "22px",
    cursor: "pointer",
    border: "none",
    background: "none",
  },
  iconButton: {
    position: "relative",
    width: "40px",
    height: "40px",
    borderRadius: "20px",
    border: "1px solid #e5e8ec",
    background: "#fff",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
  },
  bell: {
    fontSize: "16px",
    color: "#17202a",
  },
  badge: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    minWidth: "18px",
    height: "18px",
    borderRadius: "9px",
    background: "#d92d20",
    color: "#fff",
    fontSize: "11px",
    fontWeight: 800,
    display: "grid",
    placeItems: "center",
  },
  notificationMenu: {
    position: "absolute",
    top: "48px",
    right: 0,
    width: "420px",
    maxWidth: "calc(100vw - 32px)",
    background: "#fff",
    border: "1px solid #e5e8ec",
    borderRadius: "8px",
    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.16)",
    overflow: "hidden",
  },
  notificationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    borderBottom: "1px solid #eef1f5",
  },
  notificationTitle: {
    margin: 0,
    fontWeight: 800,
    color: "#17202a",
  },
  notificationMeta: {
    margin: "2px 0 0",
    color: "#667085",
    fontSize: "12px",
  },
  refreshBtn: {
    border: "1px solid #d0d5dd",
    background: "#fff",
    color: "#146c94",
    borderRadius: "6px",
    padding: "6px 10px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "12px",
  },
  notificationList: {
    maxHeight: "500px",
    overflowY: "auto",
  },
  notificationItem: {
    display: "flex",
    gap: "10px",
    padding: "12px 14px",
    borderBottom: "1px solid #f1f3f6",
    outline: "none",
  },
  unreadDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#d92d20",
    flex: "0 0 auto",
    marginTop: "6px",
  },
  notificationContent: {
    minWidth: 0,
  },
  notificationItemTitle: {
    margin: 0,
    color: "#17202a",
    fontWeight: 800,
    fontSize: "13px",
  },
  notificationMessage: {
    margin: "3px 0 0",
    color: "#475467",
    fontSize: "13px",
    lineHeight: 1.4,
    wordBreak: "break-word",
  },
  notificationTime: {
    margin: "6px 0 0",
    color: "#98a2b3",
    fontSize: "12px",
  },
  notificationState: {
    minHeight: "96px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    color: "#667085",
    fontSize: "13px",
    padding: "16px",
    textAlign: "center",
  },
  spinner: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    border: "2px solid #d0d5dd",
    borderTopColor: "#146c94",
    animation: "spin 0.8s linear infinite",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "20px",
    background: "#17202a",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 800,
  },
  menu: {
    position: "absolute",
    top: "48px",
    right: 0,
    width: "220px",
    background: "#fff",
    border: "1px solid #e5e8ec",
    borderRadius: "8px",
    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.16)",
    padding: "10px",
  },
  menuName: {
    margin: "4px 8px 0",
    fontWeight: 800,
  },
  menuMeta: {
    margin: "2px 8px 8px",
    color: "#667085",
    fontSize: "12px",
  },
  menuItem: {
    display: "block",
    width: "100%",
    padding: "9px 8px",
    border: "none",
    background: "transparent",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "6px",
  },
};

export default Navbar;
