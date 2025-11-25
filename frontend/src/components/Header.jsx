// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import menuIcon from "../assets/menu.png";
import logo2 from "../assets/logo2.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  // 라우트 바뀌면 메뉴 자동 닫기
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          {/* 왼쪽 메뉴 아이콘 */}
          <button
            className="menu-button"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <img src={menuIcon} alt="menu" />
          </button>

          {/* 가운데 로고 */}
          <div className="header-center">
            <Link to="/" onClick={closeMenu}>
              <img src={logo2} alt="ICoCM" />
            </Link>
          </div>

          {/* 오른쪽: 회원가입 / 로그인 */}
          <div className="header-actions">
            <button className="ghost" onClick={handleSignup}>
              회원가입
            </button>
            <button onClick={handleLogin}>로그인</button>
          </div>
        </div>
      </header>

      {/* 왼쪽 슬라이드 패널 */}
      <div
        className={`side-menu-backdrop ${menuOpen ? "open" : ""}`}
        onClick={closeMenu}
      >
        <nav
          className={`side-menu ${menuOpen ? "open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="side-menu-close"
            onClick={closeMenu}
            aria-label="메뉴 닫기"
          >
            ×
          </button>

          <h2 className="side-menu-title">ICoCM 메뉴</h2>
          <ul className="side-menu-list">
            <li>
              <Link to="/" onClick={closeMenu}>
                메인 화면
              </Link>
            </li>
            <li>
              <Link to="/history" onClick={closeMenu}>
                학회 연혁 / 설립취지
              </Link>
            </li>
            {/* 👉 여기서 회원가입/로그인 항목은 제거 */}
          </ul>
        </nav>
      </div>
    </>
  );
}
