"use client";
import { useEffect, useState, useCallback } from "react";
import NotificationUI from "./Notification";
import NotificationIcon from "@/components/atoms/NotificationIcon";
import { useNotification } from "@/api/notificationAPI";

const NotificationButton = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // 초기값 0으로 명시적으로 설정

  // NotificationUI에서 호출하지만 사용하지 않음
  // NotificationButton에서 API로 전체 알림을 가져와서 직접 계산하는 것이 더 정확함
  const handleUnreadCountChange = useCallback(() => {}, []);

  // 전체 알림을 가져와서 unreadCount 계산 (모달이 닫혀있을 때도)
  const { data: countData, isLoading, isError } = useNotification(1, 100); // 충분히 큰 수로 전체 가져오기

  // unreadCount 계산
  useEffect(() => {
    // 로딩 중이거나 에러가 발생하면 unreadCount를 0으로 유지 (새 알림이 없다고 간주)
    if (isLoading || isError) {
      setUnreadCount(0);
      return;
    }

    // countData가 없거나 falsy면 unreadCount를 0으로 설정
    if (!countData) {
      setUnreadCount(0);
      return;
    }

    let notificationsData = [];

    // API 응답 구조에 따라 알림 배열 추출
    if (Array.isArray(countData)) {
      notificationsData = countData;
    } else if (countData.data && Array.isArray(countData.data)) {
      notificationsData = countData.data;
    } else if (countData.notifications && Array.isArray(countData.notifications)) {
      notificationsData = countData.notifications;
    } else if (countData.items && Array.isArray(countData.items)) {
      notificationsData = countData.items;
    }

    // 알림 데이터가 없거나 빈 배열이면 unreadCount를 0으로 설정
    if (!notificationsData || notificationsData.length === 0) {
      setUnreadCount(0);
      return;
    }

    // 읽지 않은 알림 계산
    // is_read 필드만 사용 (isRead는 없음)
    // is_read가 명시적으로 true인 경우만 읽은 것으로 처리
    const unreadList = notificationsData.filter((n) => {
      const isRead = 
        n.is_read === true || 
        n.is_read === "true" || 
        n.is_read === 1 || 
        n.is_read === "1";
      // is_read: false → 읽지 않음 (새 알림)
      // is_read: true → 읽음
      return !isRead;
    });
    
    const unread = unreadList.length;

    // 계산된 읽지 않은 알림 수 설정
    setUnreadCount(unread);
  }, [countData, isLoading, isError]);

  const handleClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleClose = () => {
    setShowNotifications(false);
  };

  // 읽지 않은 알림이 있는지 확인 (0보다 크면 true)
  const hasUnread = unreadCount > 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className="relative bg-transparent border-none p-0 cursor-pointer"
        aria-label="알림"
        aria-expanded={showNotifications}
      >
        <NotificationIcon hasUnread={hasUnread} />
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
