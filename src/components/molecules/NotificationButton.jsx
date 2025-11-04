"use client";
import { useEffect, useRef, useState } from "react";
import NotificationUI from "./Notification"; // 알림 UI 컴포넌트
import NotificationIcon from "@/components/atoms/notificationIcon";
import { NOTISTATUS } from "@/constants";
import { useQueryClient } from "@tanstack/react-query";
import { useNotification, useReadNotification } from "@/api/notificationAPI";

const NotificationButton = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const notiModal = useRef();

  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();
  const { data, isLoading } = useNotification(page, 5); // GET <- 선언하면 useQuery 실행
  const { mutate: readNotification, isPending } = useReadNotification(); //PATCH

  const handleRead = (id, page) => {
    console.log("id=> ", id);
    readNotification(id, {
      onSuccess: () => {
        console.log("read 성공:", res);
        // tanstack query chach 변경
        queryClient.invalidateQueries({ queryKey: ["points", page] });
      },
      // 오류 확인
      onError: (err) => {
        console.error("read 실패:", err);
      },
    });
  };

  // mutate 확인용 코드 
  useEffect(() => {
    (async () => {
      console.log("🔍 테스트용 handleRead 실행 시작");
      try {
        const res = await handleRead(30, 1);
        console.log("✅ handleRead 성공:", res);
      } catch (err) {
        console.error("❌ handleRead 실패:", err);
      }
    })();
  }, []); // 한 번만 실행

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
      case NOTISTATUS.PURCHASED:
        return "성공적으로 구매했습니다.";
      case NOTISTATUS.SOLD:
        return "판매되었습니다.";
      case NOTISTATUS.SOLD_OUT:
        return "품절되었습니다.";
      case NOTISTATUS.TRADE_OFFERED:
        return "포토카드 교환을 제안했습니다.";
      case NOTISTATUS.TRADE_ACCEPTED:
        return "포토카드 교환이 성사되었습니다.";
      case NOTISTATUS.TRADE_REJECTED:
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

  // 더미 알림 로딩 (UI 점검용)
  const loadDummyNotifications = () => {
    const now = Date.now();
    const oneHourAgo = new Date(now - 60 * 60000).toISOString();
    const mk = (id, isRead, message) => ({
      id,
      isRead,
      time: formatTime(oneHourAgo),
      createdAtMs: Date.parse(oneHourAgo),
      message,
    });

    const dummy = [
      mk(1, false, "기며누님이 [RARE | 우리집 앞마당]을 1장 구매했습니다."),
      mk(
        2,
        false,
        "예진쓰님이 [COMMON | 스페인 여행]의 포토카드 교환을 제안했습니다."
      ),
      mk(3, true, "[LEGENDARY | 우리집 앞마당]이 품절되었습니다."),
      mk(4, true, `[RARE | How Far I’ll Go] 3장을 성공적으로 구매했습니다.`),
      mk(
        5,
        false,
        "기며누 [RARE | 우리집 앞마당] 포토카드 교환을 제안했습니다."
      ),
      mk(6, true, "예진쓰님이 [COMMON | 스페인 여행]가 품절되었습니다."),
      mk(7, false, `[RARE | How Far I’ll Go] 1장을 성공적으로 구매했습니다.`),
      mk(
        8,
        false,
        "예진쓰님이 [COMMON | 스페인 여행]의 포토카드 교환을 제안했습니다.."
      ),
    ];

    const sorted = sortNotifications(dummy);
    setNotifications(sorted);
    setUnreadCount(sorted.filter((n) => !n.isRead).length);
    setTotalPages(Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE)));
  };

  // 컴포넌트 마운트 시 더미 알림 로드 (API 비활성화)
  useEffect(() => {
    loadDummyNotifications();
  }, [currentPage]);

  // notifications 변경 시 읽지 않은 개수 동기화
  useEffect(() => {
    const unread = notifications.filter((n) => !n.isRead).length;
    setUnreadCount(unread);
  }, [notifications]);

  // 버튼 클릭 핸들러
  const handleClick = async () => {
    setShowNotifications(!showNotifications);

    // tanstack query 확인
    console.log("get data=> ", data);
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

  // 읽음 처리 (로컬만 갱신 - API 호출 주석 처리)
  const markAsRead = async (notificationId) => {
    setNotifications((prev) => {
      const updated = prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      );
      return sortNotifications(updated);
    });
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
