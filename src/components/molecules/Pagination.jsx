"use client";
import React from "react";

// Molecule: Pagination
// Props:
// - page: number (1-based)
// - pageSize: number
// - totalCount: number
// - onChange: (nextPage:number) => void
// - variant: 'default' | 'simple' (default: 'default')
//   - 'default': 숫자 페이지네이션 (dots 포함)
//   - 'simple': 간단한 이전/다음 버튼 + 현재페이지/전체페이지 표시
const Pagination = ({
  page = 1,
  pageSize = 15,
  totalCount = 0,
  onChange,
  variant = "default",
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const go = (p) => {
    if (p < 1 || p > totalPages) return;
    if (onChange) onChange(p);
  };

  const buildPages = () => {
    const pages = [];
    const push = (n) => pages.push({ type: "page", value: n });
    const dots = () => pages.push({ type: "dots" });

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) push(i);
    } else {
      const nearStart = page <= 3;
      const nearEnd = page >= totalPages - 2;
      if (nearStart) {
        push(1);
        push(2);
        push(3);
        dots();
        push(totalPages - 2);
        push(totalPages - 1);
        push(totalPages);
      } else if (nearEnd) {
        push(1);
        push(2);
        dots();
        push(totalPages - 2);
        push(totalPages - 1);
        push(totalPages);
      } else {
        push(1);
        push(2);
        dots();
        push(page);
        dots();
        push(totalPages - 1);
        push(totalPages);
      }
    }
    return pages;
  };

  const pages = buildPages();

  // Simple variant: 간단한 이전/다음 버튼 + 현재페이지/전체페이지 표시
  if (variant === "simple") {
    return (
      <div className="flex justify-center items-center gap-2 p-3 border-t border-gray-400 rounded-b-base">
        <button
          onClick={() => go(page - 1)}
          disabled={page === 1}
          className="px-2 py-1 text-noto-3xs text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:text-white"
        >
          이전
        </button>
        <span className="text-noto-3xs text-gray-300">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => go(page + 1)}
          disabled={page >= totalPages}
          className="px-2 py-1 text-noto-3xs text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:text-white"
        >
          다음
        </button>
      </div>
    );
  }

  // Default variant: 숫자 페이지네이션
  return (
    <div className="w-full flex justify-center items-center gap-xs select-none my-lg">
      {/* Prev */}
      <button
        className="text-white text-noto-base disabled:opacity-40"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label="이전 페이지"
      >
        ‹
      </button>

      {/* Pages */}
      <div className="flex items-center gap-2xs">
        {pages.map((item, idx) =>
          item.type === "dots" ? (
            <span key={`dots-${idx}`} className="text-white text-noto-3xs">
              …
            </span>
          ) : (
            <button
              key={`p-${item.value}`}
              onClick={() => go(item.value)}
              className={`text-white text-3xs px-xs py-[13px] ${
                item.value === page ? "border border-white rounded-[2px]" : ""
              }`}
            >
              {item.value}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        className="text-white text-noto-base disabled:opacity-40"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        aria-label="다음 페이지"
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;
