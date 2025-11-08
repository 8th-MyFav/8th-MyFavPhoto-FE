"use client";
import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Pagination from "./Pagination";
import { useNotification, useReadNotification } from "@/api/notificationAPI";

const NotificationUI = ({ show, onClose, onUnreadCountChange }) => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [allNotifications, setAllNotifications] = useState([]); // 전체 알림
  const [displayedNotifications, setDisplayedNotifications] = useState([]); // 현재 페이지에 표시할 알림
  const ITEMS_PER_PAGE = 5;

  // 전체 알림을 한 번에 가져오기 (충분히 큰 수로 요청)
  const { data, isLoading, isError } = useNotification(1, 100);
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

  // 알림을 최신순으로 정렬하는 함수 (방금 전이 제일 위에 오도록)
  // createdAtMs가 클수록 최신이므로 내림차순 정렬
  const sortNotifications = (list) => {
    return [...list].sort((a, b) => {
      const aTs = a.createdAtMs || 0;
      const bTs = b.createdAtMs || 0;
      return bTs - aTs; // 최신순 (내림차순) - 방금 전이 제일 위
    });
  };

  // API 데이터를 알림 형태로 변환 및 전체 알림 저장
  useEffect(() => {
    if (!show) return; // 모달이 닫혀있으면 데이터 처리 안 함

    if (isLoading) return;

    if (isError) {
      setAllNotifications([]);
      setDisplayedNotifications([]);
      return;
    }

    if (data) {
      let notificationsData = [];

      // API 응답 구조에 따라 알림 배열 추출
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
        // 전체 알림을 map으로 변환
        const apiNotifications = notificationsData.map((notification) => {
          // is_read 필드만 사용 (isRead는 없음)
          const isRead =
            notification.is_read === true ||
            notification.is_read === "true" ||
            notification.is_read === 1 ||
            notification.is_read === "1";
          const createdAt = notification.createdAt || notification.created_at;

          return {
            id: notification.id,
            isRead,
            message: notification.content || "",
            time: formatTime(createdAt),
            createdAtMs: Date.parse(createdAt || new Date()),
          };
        });

        // 전체 알림을 최신순으로 정렬 (방금 전이 제일 위)
        const sorted = sortNotifications(apiNotifications);
        setAllNotifications(sorted);
      } else {
        setAllNotifications([]);
        setDisplayedNotifications([]);
      }
    } else {
      setAllNotifications([]);
      setDisplayedNotifications([]);
    }
  }, [data, isLoading, isError, show]);

  // 전체 알림에서 현재 페이지에 해당하는 알림만 추출
  useEffect(() => {
    if (allNotifications.length === 0) {
      setDisplayedNotifications([]);
      return;
    }

    // 현재 페이지에 표시할 알림 계산 (프론트엔드 페이지네이션)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageNotifications = allNotifications.slice(startIndex, endIndex);

    setDisplayedNotifications(pageNotifications);
  }, [allNotifications, currentPage]);

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
          ? { ...notification, is_read: true }
          : notification
      );

      return Array.isArray(oldData) ? updated : { ...oldData, data: updated };
    });

    // PATCH API 호출
    readNotification(id, {
      onSuccess: () => {
        // 읽음 처리 성공 후 전체 알림 상태 업데이트
        setAllNotifications((prev) => {
          const updated = prev.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          );
          return updated;
        });

        // API 캐시 무효화하여 NotificationButton에서 전체 알림을 다시 가져오도록 함
        // 이렇게 하면 NotificationButton의 unreadCount가 정확하게 업데이트됨
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

  // 전체 알림 수와 총 페이지 수 계산
  const totalCount = allNotifications.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

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
        className={`fixed inset-0 flex h-full w-full flex-col gap-[16px] bg-noti-read px-x-mobile py-[24px] shadow-xl/30 z-50 pointer-events-auto overflow-hidden tablet:absolute tablet:inset-auto tablet:top-full tablet:left-1/2 tablet:-translate-x-1/2 tablet:w-[300px] tablet:h-auto tablet:px-0 tablet:py-0 tablet:flex-col tablet:gap-0 tablet:overflow-visible ${
          totalPages > 1 ? "tablet:rounded-t-base" : "tablet:rounded-base"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-[56px] items-center justify-between border-b border-gray-400 px-[4px] tablet:hidden">
          <button
            type="button"
            onClick={onClose}
            aria-label="알림 닫기"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent"
          >
            <img src="/icons/leftArrow.svg" alt="Back" className="h-5 w-5" />
          </button>
          <h2 className="text-white text-noto-3xs">알림</h2>
          <div className="h-10 w-10" />
        </div>

        <div className="flex-1 flex flex-col gap-0 overflow-y-auto pt-[8px] tablet:flex-none tablet:overflow-visible tablet:pt-0">
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

        {/* 페이지네이션 - 전체 알림이 5개보다 많을 때만 표시 */}
        {totalCount > ITEMS_PER_PAGE && (
          <div className="mt-auto tablet:mt-0">
            <Pagination
              page={currentPage}
              pageSize={ITEMS_PER_PAGE}
              totalCount={totalCount}
              onChange={handlePageChange}
              variant="simple"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationUI;
