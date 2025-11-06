"use client";
import { useEffect, useState, useCallback } from "react";
import NotificationUI from "./Notification";
import NotificationIcon from "@/components/atoms/NotificationIcon";
import { useNotification } from "@/api/notificationAPI";

const NotificationButton = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // useCallback으로 메모이제이션하여 불필요한 재렌더링 방지
  const handleUnreadCountChange = useCallback((count) => {
    setUnreadCount(count);
  }, []);

  // 전체 알림을 가져와서 unreadCount 계산 (모달이 닫혀있을 때도)
  const { data: countData } = useNotification(1, 100); // 충분히 큰 수로 전체 가져오기

  // unreadCount 계산
  useEffect(() => {
    if (countData) {
      let notificationsData = [];

      if (Array.isArray(countData)) {
        notificationsData = countData;
      } else if (countData.data && Array.isArray(countData.data)) {
        notificationsData = countData.data;
      } else if (
        countData.notifications &&
        Array.isArray(countData.notifications)
      ) {
        notificationsData = countData.notifications;
      } else if (countData.items && Array.isArray(countData.items)) {
        notificationsData = countData.items;
      }

      const unread = notificationsData.filter(
        (n) => !(n.is_read ?? n.isRead ?? false)
      ).length;

      console.log(
        "📊 unreadCount 업데이트:",
        unread,
        "전체:",
        notificationsData.length
      );
      setUnreadCount(unread);
    }
  }, [countData]);

  const handleClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleClose = () => {
    setShowNotifications(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className="relative bg-transparent border-none p-0 cursor-pointer"
        aria-label="알림"
        aria-expanded={showNotifications}
      >
        <NotificationIcon hasUnread={unreadCount > 0} />
      </button>

      <NotificationUI
        show={showNotifications}
        onClose={handleClose}
        onUnreadCountChange={handleUnreadCountChange}
      />
    </div>
  );
};

export default NotificationButton;
