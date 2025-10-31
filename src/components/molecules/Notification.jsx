"use client";
import React from "react";

const NotificationUI = ({
  show,
  notifications,
  onClose,
  onItemClick,
  currentPage,
  totalPages,
  onPageChange,
}) => {
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
        className="absolute top-full left-1/2 transform -translate-x-1/2 w-[300px] bg-[#161616] rounded-[2px] shadow-xl/30 z-50 pointer-events-auto rounded-t-[2px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-0">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => onItemClick(n.id)}
              className={`w-full h-[107px] rounded-none flex justify-start items-center cursor-pointer transition border-b border-[var(--color-gray-400)] px-[20px] text-left 
                ${n.isRead ? "bg-[#161616]" : "bg-[#222222]"}`}
            >
              {/* 내부 컨텐츠 (API 형식에 맞춤) */}
              <div className="flex flex-col justify-between text-sm">
                <p
                  className={`text-[14px] font-noto ${
                    n.isRead ? "text-[var(--color-gray-400)]" : "text-white"
                  }`}
                >
                  {n.message || "새로운 알림이 없습니다."}
                </p>
                <span className="text-[12px] text-[var(--color-gray-400)] font-noto">
                  {n.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-3 border-t border-[var(--color-gray-400)]">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 text-xs text-[var(--color-gray-300)] disabled:opacity-50 disabled:cursor-not-allowed hover:text-white"
            >
              이전
            </button>
            <span className="text-xs text-[var(--color-gray-300)]">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-xs text-[var(--color-gray-300)] disabled:opacity-50 disabled:cursor-not-allowed hover:text-white"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationUI;
