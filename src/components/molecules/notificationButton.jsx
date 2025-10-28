"use client";
import { useEffect, useState } from "react";
import NotificationUI from "./alram"; // 알림 UI 컴포넌트

const NotificationButton = () => {
  const [notifications, setNotifications] = useState([
    // 하드코딩된 알림 데이터 (API 형식에 맞춤)
    {
      id: 1,
      name: "기며누",
      grade: "RARE",
      content: "우리집 앞마당",
      count: 1,
      action: "구매했",
      time: "1시간 전",
      isRead: false,
    },
    {
      id: 2,
      name: "예진쓰",
      grade: "COMMON",
      content: "스페인 여행",
      count: "포토카드",
      action: "교환 제안했",
      time: "1시간 전",
      isRead: false,
    },
    {
      id: 3,
      name: "",
      grade: "LEGENDARY",
      content: "우리집 앞마당",
      count: "",
      action: "품절되었",
      time: "1시간 전",
      isRead: true,
    },
    {
      id: 4,
      name: "",
      grade: "RARE",
      content: "How Far I’ll Go",
      count: 3,
      action: "성공적으로 구매했",
      time: "1시간 전",
      isRead: true,
    },
    {
      id: 5,
      name: "",
      grade: "LEGENDARY",
      content: "우리집 앞마당",
      count: "",
      action: "품절되었",
      time: "1시간 전",
      isRead: true,
    },
  ]);

  // 읽지 않은 알림 수 계산
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const [showNotifications, setShowNotifications] = useState(false);

  // 알림 목록 불러오기 (안전하게)
  const fetchNotifications = async (signal) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
        {
          credentials: "include",
          method: "GET",
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
      let list = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data.notifications)) {
        list = data.notifications;
      } else if (Array.isArray(data.data)) {
        list = data.data;
      } else {
        console.warn("알림 응답 형식이 예상과 다릅니다:", data);
        return;
      }

      // 읽지 않은 알림의 개수를 계산
      const unread = list.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
      setNotifications(list); // 알림 목록도 상태에 저장
    } catch (err) {
      if (err.name === "AbortError") {
        return; // 의도적 취소
      }
      console.error("알림 불러오기 실패:", err);
    }
  };

  // 컴포넌트 마운트 시 알림 목록을 불러옴 (하드코딩으로 비활성화)
  // useEffect(() => {
  //   const controller = new AbortController();
  //   fetchNotifications(controller.signal);

  //   return () => controller.abort(); // 컴포넌트 언마운트 시 fetch 취소
  // }, []);

  const handleClick = () => {
    console.log("알림 버튼 클릭됨!");
    setShowNotifications(!showNotifications);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative bg-transparent border-none p-0 cursor-pointer"
      aria-label="알림"
      aria-expanded={undefined}
    >
      <img
        src={unreadCount > 0 ? "/icons/alarmUnread.svg" : "/icons/alarm.svg"}
        alt="알림"
        width={24}
        height={24}
      />

      {/* 하드코딩된 알림 모달 UI */}
      {showNotifications && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
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
                  onClick={() => {
                    // 읽음 처리 (alarm.jsx에서 가져옴)
                    setNotifications((prev) =>
                      prev.map((notification) =>
                        notification.id === n.id
                          ? { ...notification, isRead: true }
                          : notification
                      )
                    );
                  }}
                  className={`w-full h-[107px] rounded-none flex justify-center items-center cursor-pointer transition border-b border-[var(--color-gray-400)] px-[20px] text-left 
                    ${n.isRead ? "bg-[#161616]" : "bg-[#222222]"}`}
                >
                  {/* 내부 컨텐츠 (API 형식에 맞춤) */}
                  <div className="flex flex-col justify-between text-sm">
                    <p
                      className={`text-[14px] font-noto ${
                        n.isRead ? "text-[var(--color-gray-400)]" : "text-white"
                      }`}
                    >
                      {n.name && `${n.name}님이 `}[{n.grade} | {n.content}]을{" "}
                      {n.count && typeof n.count === "number"
                        ? `${n.count}장 `
                        : n.count
                        ? `${n.count} `
                        : ""}
                      {n.action}습니다.
                    </p>
                    <span className="text-[12px] text-[var(--color-gray-400)] font-noto">
                      {n.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </button>
  );
};

export default NotificationButton;
