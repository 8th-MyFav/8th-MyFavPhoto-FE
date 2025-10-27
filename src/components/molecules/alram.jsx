"use client";
import React, { useState } from "react";

const NotificationUI = () => {
  const [show, setShow] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      name: "홍승전",
      grade: "COMMON",
      content: "카드 뽑기",
      count: 3,
      action: "획득하셨",
      time: "1시간 전",
      isRead: false,
    },
    {
      id: 2,
      name: "홍승전",
      grade: "LEGENDARY",
      content: "랜덤박스",
      count: 1,
      action: "열으셨",
      time: "2시간 전",
      isRead: false,
    },
    {
      id: 3,
      name: "홍승전",
      grade: "RARE",
      content: "교환 제안",
      count: 2,
      action: "받으셨",
      time: "3시간 전",
      isRead: false,
    },
    {
      id: 4,
      name: "홍승전",
      grade: "COMMON",
      content: "포인트 보상",
      count: 5,
      action: "획득하셨",
      time: "5시간 전",
      isRead: false,
    },
    {
      id: 5,
      name: "홍승전",
      grade: "LEGENDARY",
      content: "카드 합성",
      count: 1,
      action: "완료하셨",
      time: "1일 전",
      isRead: false,
    },
  ]);

  // 알림창 ON/OFF 토글
  const handleToggle = () => {
    setShow((prev) => !prev);
  };

  // 클릭 시 읽음 처리
  const handleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div className="flex flex-col items-center mt-[100px]">
      {/* 임시 알림 버튼 */}
      <button
        onClick={handleToggle}
        className="px-4 py-2 bg-yellow-400 text-black rounded-md font-bold"
      >
        알림 버튼
      </button>

      {/* 알림창 컨테이너 */}
      {show && (
        <div className="flex flex-col mt-5 gap-0">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleRead(n.id)}
              className={`w-[300px] h-[107px] rounded-none flex justify-center items-center cursor-pointer transition border-b border-[#3A3A3A] ${
                n.isRead ? "bg-[#222222] opacity-60" : "bg-[#161616]"
              }`}
            >
              {/* 내부 컨텐츠 */}
              <div className="w-[260px] h-[67px] flex flex-col justify-between text-white text-sm">
                <p className="text-[14px] font-regular">
                  {n.name}님이 [{n.grade} | {n.content}]을 {n.count}장{" "}
                  {n.action}
                  습니다.
                </p>
                <span className="text-[12px] text-[#A4A4A4]">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationUI;
