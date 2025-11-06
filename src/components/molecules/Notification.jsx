"use client";
import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Pagination from "./Pagination";
import { useNotification, useReadNotification } from "@/api/notificationAPI";

const NotificationUI = ({ show, onClose, onUnreadCountChange }) => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const { data, isLoading, isError } = useNotification(currentPage, 5);
  const { mutate: readNotification } = useReadNotification();

  const formatTime = (iso) => {
    if (!iso) return "";
    try {
      const date = new Date(iso);
      const diffMs = Date.now() - date.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return "방금 전";
      if (diffMin < 60) return `${diffMin}분 전`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}시간 전`;
      const diffDay = Math.floor(diffHr / 24);
      return `${diffDay}일 전`;
    } catch {
      return "";
    }
  };

  const sortNotifications = (list) => {
    return [...list].sort((a, b) => {
      if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
      const aTs = a.createdAtMs || 0;
      const bTs = b.createdAtMs || 0;
      return bTs - aTs;
    });
  };

  // API 데이터를 알림 형태로 변환
  useEffect(() => {
    if (!show) return; // 모달이 닫혀있으면 데이터 처리 안 함

    if (isLoading) return;

    if (isError) {
      setNotifications([]);
      setTotalPages(1);
      return;
    }

    if (data) {
      let notificationsData = [];

      if (Array.isArray(data)) {
        notificationsData = data;
      } else if (data.data && Array.isArray(data.data)) {
        notificationsData = data.data;
      } else if (data.notifications && Array.isArray(data.notifications)) {
        notificationsData = data.notifications;
      } else if (data.items && Array.isArray(data.items)) {
        notificationsData = data.items;
      }

      if (notificationsData.length > 0) {
        const apiNotifications = notificationsData.map((notification) => {
          const isRead = notification.is_read ?? notification.isRead ?? false;
          const createdAt = notification.createdAt || notification.created_at;

          return {
            id: notification.id,
            isRead,
            message: notification.content || "",
            time: formatTime(createdAt),
            createdAtMs: Date.parse(createdAt || new Date()),
          };
        });

        const sorted = sortNotifications(apiNotifications);
        setNotifications(sorted);
        setTotalPages(Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE)));
      } else {
        setNotifications([]);
        setTotalPages(1);
      }
    } else {
      setNotifications([]);
      setTotalPages(1);
    }
  }, [data, isLoading, isError, show]);

  // notifications 변경 시 unreadCount를 부모에게 전달
  useEffect(() => {
    if (!show || !onUnreadCountChange) return;

    const unread = notifications.filter((n) => !n.isRead).length;
    console.log("📊 notifications 변경 시 unreadCount 업데이트:", unread);
    onUnreadCountChange(unread);
  }, [notifications, show, onUnreadCountChange]);

  const handleRead = (id) => {
    if (!queryClient) {
      console.error("queryClient가 없습니다.");
      return;
    }

    // Optimistic update
    queryClient.setQueriesData({ queryKey: ["notification"] }, (oldData) => {
      if (!oldData?.data && !Array.isArray(oldData)) return oldData;

      const notificationsData = Array.isArray(oldData)
        ? oldData
        : oldData.data || oldData.notifications || oldData.items || [];

      const updated = notificationsData.map((notification) =>
        notification.id === id
          ? { ...notification, is_read: true, isRead: true }
          : notification
      );

      return Array.isArray(oldData) ? updated : { ...oldData, data: updated };
    });

    // PATCH API 호출
    readNotification(id, {
      onSuccess: () => {
        // 읽음 처리 성공 후 상태 업데이트
        setNotifications((prev) => {
          return prev.map((n) => (n.id === id ? { ...n, isRead: true } : n));
        });
        queryClient.invalidateQueries({ queryKey: ["notification"] });
      },
      onError: (err) => {
        console.error("read 실패:", err);
        queryClient.invalidateQueries({ queryKey: ["notification"] });
      },
    });
  };

  const handleItemClick = (id) => {
    handleRead(id);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // 현재 페이지에 표시할 알림만 슬라이싱
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedNotifications = notifications.slice(startIndex, endIndex);

  if (!show) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        style={{ pointerEvents: "auto" }}
      />
      {/* 알림 모달 */}
      <div
        className={`absolute top-full left-1/2 transform -translate-x-1/2 w-[300px] bg-noti-read shadow-xl/30 z-50 pointer-events-auto ${
          totalPages > 1 ? "rounded-t-base" : "rounded-base"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-0">
          {displayedNotifications.length > 0 ? (
            displayedNotifications.map((n, index) => (
              <div
                key={n.id}
                onClick={() => handleItemClick && handleItemClick(n.id)}
                className={`w-full h-[107px] rounded-none flex justify-start items-center cursor-pointer transition border-b border-gray-400 px-[20px] text-left 
                  ${n.isRead ? "bg-noti-read" : "bg-noti-unread"}
                ${
                  totalPages <= 1 && index === displayedNotifications.length - 1
                    ? "border-b-0 rounded-b-base"
                    : ""
                }`}
              >
                <div className="flex flex-col justify-between text-sm">
                  <p
                    className={`text-noto-3xs ${
                      n.isRead ? "text-gray-400" : "text-white"
                    }`}
                  >
                    {n.message || "새로운 알림이 없습니다."}
                  </p>
                  <span className="text-gray-400 text-noto-4xs mt-1">
                    {n.time}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-[107px] rounded-base flex justify-center items-center px-[20px]">
              <p className="text-gray-400 text-noto-3xs">
                새로운 알림이 없습니다.
              </p>
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <Pagination
            page={currentPage}
            pageSize={ITEMS_PER_PAGE}
            totalCount={notifications.length}
            onChange={handlePageChange}
            variant="simple"
          />
        )}
      </div>
    </>
  );
};

export default NotificationUI;
