"use client";
import { useEffect, useState } from "react";
import NotificationUI from "./alram"; // 알림 UI 컴포넌트

const NotificationButton = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 5;

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

  const messageFromCategory = (category) => {
    switch (category) {
      case "PURCHASED":
        return "성공적으로 구매했습니다.";
      case "SOLD":
        return "판매되었습니다.";
      case "SOLD_OUT":
        return "품절되었습니다.";
      case "TRADE_OFFER":
        return "포토카드 교환을 제안했습니다.";
      case "TRADE_ACCEPTED":
        return "포토카드 교환이 성사되었습니다.";
      case "TRADE_REJECTED":
        return "교환을 거절했습니다.";
      default:
        return category || "알림이 도착했습니다.";
    }
  };

  // 정렬: 읽지 않은 알림 우선, 그 다음 최신순
  const sortNotifications = (list) => {
    return [...list].sort((a, b) => {
      if (a.isRead !== b.isRead) return a.isRead ? 1 : -1; // unread first
      const aTs = a.createdAtMs || 0;
      const bTs = b.createdAtMs || 0;
      return bTs - aTs; // newest first
    });
  };

  // 알림 목록 불러오기 (서버 페이지네이션 사용)
  const fetchNotifications = async (signal, page = 1) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.warn("액세스 토큰이 없습니다.");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications?page=${page}&pageSize=${ITEMS_PER_PAGE}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          signal,
        }
      );

      const contentType = res.headers.get("content-type") || "";
      if (!res.ok) {
        const text = await res.text();
        console.error("알림 API 오류", res.status, text.slice(0, 500));
        return;
      }

      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error(
          "알림 API가 JSON을 반환하지 않음:",
          contentType,
          text.slice(0, 500)
        );
        return;
      }

      const data = await res.json();

      // 서버에서 배열로 직접 반환
      if (!Array.isArray(data)) {
        console.warn("알림 응답이 배열이 아닙니다:", data);
        return;
      }

      // API 응답 데이터를 UI 형식으로 변환
      const formattedNotifications = data.map((item) => ({
        id: item.id,
        isRead: Boolean(item.is_read),
        time: item.createdAt ? formatTime(item.createdAt) : "",
        createdAtMs: item.createdAt ? Date.parse(item.createdAt) : 0,
        message: messageFromCategory(item.category),
      }));

      const sorted = sortNotifications(formattedNotifications);

      // 읽지 않은 알림의 개수를 계산 (현재 페이지 기준)
      const unread = sorted.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
      setNotifications(sorted);

      // 서버 페이지네이션: 현재 페이지가 마지막 페이지인지 확인
      // (5개 미만이면 마지막 페이지로 간주)
      const isLastPage = data.length < ITEMS_PER_PAGE;
      if (isLastPage) {
        setTotalPages(currentPage);
      } else {
        setTotalPages(currentPage + 1); // 다음 페이지가 있을 가능성
      }
    } catch (err) {
      if (err.name === "AbortError") {
        return; // 의도적 취소
      }
      console.error("알림 불러오기 실패:", err);
    }
  };

  // 컴포넌트 마운트 시 알림 목록을 불러옴
  useEffect(() => {
    const controller = new AbortController();
    fetchNotifications(controller.signal, currentPage);
    return () => controller.abort(); // 컴포넌트 언마운트 시 fetch 취소
  }, [currentPage]);

  // notifications 변경 시 읽지 않은 개수 동기화
  useEffect(() => {
    const unread = notifications.filter((n) => !n.isRead).length;
    setUnreadCount(unread);
  }, [notifications]);

  // 버튼 클릭 핸들러
  const handleClick = () => {
    console.log("알림 버튼 클릭됨!");
    setShowNotifications(!showNotifications);
  };

  // 모달 닫기 핸들러
  const handleClose = () => {
    setShowNotifications(false);
  };

  // 알림 아이템 클릭 핸들러 (읽음 처리)
  const handleItemClick = (id) => {
    // 서버에 읽음 처리 요청
    markAsRead(id);
  };

  // 페이지네이션 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 읽음 처리 API 호출
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        // 서버에서 읽음 처리 성공 시 로컬 상태도 업데이트 + 정렬 반영
        setNotifications((prev) => {
          const updated = prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          );
          return sortNotifications(updated);
        });
      }
    } catch (error) {
      console.error("읽음 처리 실패:", error);
    }
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
        <img
          src={unreadCount > 0 ? "/icons/alarmUnread.svg" : "/icons/alarm.svg"}
          alt="알림"
          width={24}
          height={24}
        />
      </button>

      <NotificationUI
        show={showNotifications}
        notifications={notifications}
        onClose={handleClose}
        onItemClick={handleItemClick}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default NotificationButton;
