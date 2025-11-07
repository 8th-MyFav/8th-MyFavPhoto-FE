"use client";
import { useEffect, useState, useCallback } from "react";
import NotificationUI from "./Notification";
import NotificationIcon from "@/components/atoms/NotificationIcon";
import { useNotification } from "@/api/notificationAPI";

const NotificationButton = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // 초기값 0으로 명시적으로 설정

  // useCallback으로 메모이제이션하여 불필요한 재렌더링 방지
  // 주의: NotificationUI에서 호출하지만, 전체 알림을 가져와서 계산하는 것이 더 정확하므로
  // 이 함수로는 상태를 업데이트하지 않음 (NotificationButton의 useEffect에서 직접 계산)
  const handleUnreadCountChange = useCallback((count) => {
    // NotificationUI에서 현재 페이지 기준으로 unreadCount를 전달하지만,
    // 전체 알림을 기준으로 계산하는 것이 더 정확하므로 무시
    // NotificationButton의 useEffect에서 API로 직접 계산한 값이 최종 값
  }, []);

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
    // API 응답에 totalCount가 포함되어 있을 수 있음
    let apiTotalCount = 0;

    if (Array.isArray(countData)) {
      notificationsData = countData;
      apiTotalCount = countData.length;
    } else if (countData.data && Array.isArray(countData.data)) {
      notificationsData = countData.data;
      apiTotalCount =
        countData.totalCount ?? countData.total ?? countData.data.length;
    } else if (
      countData.notifications &&
      Array.isArray(countData.notifications)
    ) {
      notificationsData = countData.notifications;
      apiTotalCount =
        countData.totalCount ??
        countData.total ??
        countData.notifications.length;
    } else if (countData.items && Array.isArray(countData.items)) {
      notificationsData = countData.items;
      apiTotalCount =
        countData.totalCount ?? countData.total ?? countData.items.length;
    }

    // 알림 데이터가 없거나 빈 배열이면 unreadCount를 0으로 설정
    if (!notificationsData || notificationsData.length === 0) {
      setUnreadCount(0);
      return;
    }

    // API 응답 전체 확인 (디버깅)
    console.log("📋 API 응답 전체 데이터:", {
      countData,
      notificationsData,
      notificationsDataLength: notificationsData.length,
      첫번째알림: notificationsData[0]
        ? {
            id: notificationsData[0].id,
            is_read: notificationsData[0].is_read,
            isRead: notificationsData[0].isRead,
            모든키: Object.keys(notificationsData[0]),
          }
        : null,
    });

    // 읽지 않은 알림 계산
    // 모든 알림의 is_read 값을 먼저 확인 (디버깅용)
    const allNotificationsInfo = notificationsData.map((n, idx) => ({
      index: idx,
      id: n.id,
      is_read: n.is_read,
      isRead: n.isRead,
      모든필드: Object.keys(n),
    }));

    console.log("🔍 전체 알림 is_read 값 확인:", {
      전체알림수: notificationsData.length,
      모든알림정보: allNotificationsInfo,
    });

    const unreadList = notificationsData.filter((n) => {
      // is_read 또는 isRead 필드 확인
      // 두 필드 모두 확인하고, 하나라도 true면 읽은 것으로 처리
      const isReadByRead =
        n.is_read === true ||
        n.is_read === "true" ||
        n.is_read === 1 ||
        n.is_read === "1";
      const isReadByReadCamel =
        n.isRead === true ||
        n.isRead === "true" ||
        n.isRead === 1 ||
        n.isRead === "1";

      // 둘 중 하나라도 true면 읽은 것
      const isRead = isReadByRead || isReadByReadCamel;

      // 읽지 않은 알림: is_read와 isRead가 모두 true가 아닌 경우
      // null, undefined, false, 0, "false", "0" 등은 읽지 않은 것으로 처리
      return !isRead;
    });

    // 필터링 결과 확인
    console.log("🔍 필터링 결과:", {
      전체알림수: notificationsData.length,
      읽지않은알림수: unreadList.length,
      읽은알림수: notificationsData.length - unreadList.length,
    });

    const unread = unreadList.length;

    // 디버깅: 새로운 알림(읽지 않은 알림)이 있을 때만 상세 로그 표시
    if (unread > 0) {
      console.log("🔴 읽지 않은 알림 상세:", {
        전체알림수: notificationsData.length,
        읽지않은알림수: unread,
        읽지않은알림: unreadList.map((n) => ({
          id: n.id,
          is_read: n.is_read,
          isRead: n.isRead,
          content: n.content || n.message || "",
        })),
        전체알림상세: notificationsData.map((n) => ({
          id: n.id,
          is_read: n.is_read,
          isRead: n.isRead,
          isRead값: n.is_read ?? n.isRead,
          isRead타입: typeof (n.is_read ?? n.isRead),
          content: n.content || n.message || "",
        })),
      });
    } else {
      // 읽지 않은 알림이 없는데도 문제가 있을 때 디버깅
      console.log("✅ 읽지 않은 알림 없음 - 전체 알림 확인:", {
        전체알림수: notificationsData.length,
        전체알림: notificationsData.map((n) => ({
          id: n.id,
          is_read: n.is_read,
          isRead: n.isRead,
          is_read값: n.is_read,
          isRead값: n.isRead,
          content: n.content || n.message || "",
        })),
      });
    }

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
