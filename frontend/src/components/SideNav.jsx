// src/components/SideNav.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SideNav.css";

export default function SideNav() {
  const [open, setOpen] = useState(false);

  const closeNav = () => setOpen(false);

  return (
    <>
      {/* 왼쪽 상단 햄버거 버튼 */}
      <button
        className="side-nav-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="메뉴 열기"
      >
        <span />
        <span />
        <span />
      </button>

      {/* 오버레이 + 실제 패널 */}
      <div
        className={`side-nav-backdrop ${open ? "open" : ""}`}
        onClick={closeNav}
      >
        <nav
          className={`side-nav ${open ? "open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="side-nav-close"
            onClick={closeNav}
            aria-label="메뉴 닫기"
          >
            ×
          </button>

          <h2 className="side-nav-title">ICoCM 메뉴</h2>

          <ul className="side-nav-list">
            <li>
              <Link to="/" onClick={closeNav}>
                메인 화면
              </Link>
            </li>
            <li>
              <Link to="/history" onClick={closeNav}>
                학회 연혁 / 설립취지
              </Link>
            </li>
            <li>
              <Link to="/notices" onClick={closeNav}>
                공지사항
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
