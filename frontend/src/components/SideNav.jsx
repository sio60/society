import React from "react";
import "./SideNav.css";

export default function SideNav({ isOpen, onClose, onNavigate }) {
  return (
    <>
      {/* 어두운 배경 */}
      <div
        className={`side-backdrop ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      {/* 왼쪽 패널 */}
      <nav className={`side-nav ${isOpen ? "open" : ""}`}>
        <div className="side-nav-header">
          <span className="side-nav-title">메뉴</span>
          <button className="side-nav-close" onClick={onClose}>
            ×
          </button>
        </div>

        <ul className="side-nav-list">
          <li>
            <button onClick={() => onNavigate("hero")}>홈</button>
          </li>
          <li>
            <button onClick={() => onNavigate("about")}>학회 소개</button>
          </li>
          <li>
            <button onClick={() => onNavigate("programs")}>주요 활동</button>
          </li>
          <li>
            <button onClick={() => onNavigate("history")}>학회 연혁</button>
          </li>
          <li>
            <button onClick={() => onNavigate("footer")}>문의 / 연락처</button>
          </li>
        </ul>
      </nav>
    </>
  );
}
