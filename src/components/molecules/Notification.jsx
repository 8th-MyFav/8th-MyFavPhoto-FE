"use client";
import React, { useState, useMemo } from "react";
import Pagination from "./Pagination";

const NotificationUI = ({
  show,
  notifications,
  onClose,
  onItemClick,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // 더미 알림 8개 생성
  const dummyNotifications = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      message: `알림 메시지 ${i + 1}: 새로운 포토카드 거래가 완료되었습니다.`,
      time: `${i + 1}분 전`, 
      isRead: i % 3 === 0, // 일부는 읽음 처리
    }));
  }, []);

  // 실제 notifications가 있으면 사용, 없으면 더미 데이터 사용
  const allNotifications =
    notifications && notifications.length > 0
      ? notifications
      : dummyNotifications;

  // 페이지당 5개씩 표시
  const itemsPerPage = 5;
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);

  // 외부 제어 사용 여부: currentPage와 onPageChange가 모두 있을 때만 외부 제어
  const useExternalPagination =
    currentPage != null && typeof onPageChange === "function";
  // 외부에서 currentPage를 받았고 핸들러도 있으면 외부 값 사용, 아니면 내부 상태 사용
  const activeCurrentPage = useExternalPagination
    ? currentPage
    : internalCurrentPage;

  // 전체 페이지 수 계산
  const calculatedTotalPages =
    (useExternalPagination && totalPages) ||
    Math.ceil(allNotifications.length / itemsPerPage);

  // 현재 페이지에 표시할 알림만 슬라이싱
  const startIndex = (activeCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedNotifications = allNotifications.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    if (useExternalPagination) {
      onPageChange(newPage);
      return;
    }
    setInternalCurrentPage(newPage);
  };

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
          calculatedTotalPages > 1 ? "rounded-t-base" : "rounded-base"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-0">
          {displayedNotifications.map((n, index) => (
            <div
              key={n.id}
              onClick={() => onItemClick && onItemClick(n.id)}
              className={`w-full h-[107px] rounded-none flex justify-start items-center cursor-pointer transition border-b border-gray-400 px-[20px] text-left 
                ${n.isRead ? "bg-noti-read" : "bg-noti-unread"}
                ${
                  calculatedTotalPages <= 1 &&
                  index === displayedNotifications.length - 1
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
                <span className="text-gray-400 text-noto-4xs">{n.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        {calculatedTotalPages > 1 && (
          <Pagination
            page={activeCurrentPage}
            pageSize={itemsPerPage}
            totalCount={allNotifications.length}
            onChange={handlePageChange}
            variant="simple"
          />
        )}
      </div>
    </>
  );
};

export default NotificationUI;
