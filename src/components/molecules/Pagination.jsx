"use client";
import React from "react";

// Molecule: Pagination
// Props:
// - page: number (1-based)
// - pageSize: number
// - totalCount: number
// - onChange: (nextPage:number) => void
const Pagination = ({ page = 1, pageSize = 15, totalCount = 0, onChange }) => {
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
