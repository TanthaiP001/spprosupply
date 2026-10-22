"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hrefForPage?: (page: number) => string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hrefForPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const renderPageControl = (
    page: number,
    className: string,
    children: React.ReactNode,
    extraProps: { "aria-label"?: string; "aria-current"?: "page"; disabled?: boolean } = {}
  ) => {
    const { disabled, ...ariaProps } = extraProps;
    if (hrefForPage && !disabled) {
      return (
        <Link
          href={hrefForPage(page)}
          scroll={false}
          onClick={(e) => {
            e.preventDefault();
            onPageChange(page);
          }}
          className={className}
          {...ariaProps}
        >
          {children}
        </Link>
      );
    }
    return (
      <button
        type="button"
        onClick={() => onPageChange(page)}
        disabled={disabled}
        className={className}
        {...ariaProps}
      >
        {children}
      </button>
    );
  };

  const arrowClass =
    "p-2 text-gray-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors";

  return (
    <nav aria-label="เลขหน้า" className="mt-8 flex flex-wrap items-center justify-center gap-1 md:mt-12">
      {renderPageControl(Math.max(1, currentPage - 1), arrowClass, <ChevronLeft className="w-5 h-5" />, {
        "aria-label": "หน้าก่อนหน้า",
        disabled: currentPage === 1,
      })}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-sm font-light text-gray-400"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isCurrent = currentPage === pageNum;
          return (
            <span key={pageNum}>
              {renderPageControl(
                pageNum,
                `inline-flex items-center justify-center min-w-[36px] h-9 px-3 text-sm font-light transition-colors ${
                  isCurrent
                    ? "bg-black text-white"
                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`,
                pageNum,
                isCurrent ? { "aria-current": "page" } : {}
              )}
            </span>
          );
        })}
      </div>

      {renderPageControl(
        Math.min(totalPages, currentPage + 1),
        arrowClass,
        <ChevronRight className="w-5 h-5" />,
        { "aria-label": "หน้าถัดไป", disabled: currentPage === totalPages }
      )}
    </nav>
  );
}
