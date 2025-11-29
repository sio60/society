// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import menuIcon from "../assets/menu.png";
import logo2 from "../assets/logo2.png";
import { supabase } from "../lib/supabaseClient";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [damyangOpen, setDamyangOpen] = useState(false); // 🔹 담양 드롭다운
  const [user, setUser] = useState(null);

  // 🔹 프로그램 카테고리 (Supabase program_categories에서 불러옴)
  const [programCategories, setProgramCategories] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => {
    setMenuOpen(false);
    setDamyangOpen(false); // 메뉴 닫힐 때 같이 닫기
  };

  // admin 여부 (관리자 이메일 기준)
  const isAdmin = user?.email === "admin@icocm.org";

  // 라우트 바뀌면 메뉴 자동 닫기
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // 로그인 상태 감지
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  // 🔹 프로그램 카테고리 목록 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("program_categories")
        .select("slug, label, sort_order")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("프로그램 카테고리 불러오기 오류:", error);
        return;
      }
      setProgramCategories(data || []);
    };

    fetchCategories();
  }, []);

  // 🔹 '담양군 지부' 드롭다운에 들어갈 카테고리(health-journal)와 나머지 분리
  const damyangSlug = "health-journal";
  const damyangCategory = programCategories.find(
    (cat) => cat.slug === damyangSlug
  );
  const otherCategories = programCategories.filter(
    (cat) => cat.slug !== damyangSlug
  );

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          {/* 가운데 로고만 딱 중앙 */}
          <div className="header-center">
            <Link to="/" onClick={closeMenu}>
              <img src={logo2} alt="ICoCM" />
            </Link>
          </div>

          {/* 왼쪽 메뉴 / 오른쪽 버튼 */}
          <div className="header-edges">
            {/* 왼쪽 메뉴 버튼 */}
            <button
              className="menu-button"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <img src={menuIcon} alt="menu" />
            </button>

            {/* 오른쪽 회원가입 / 로그인 / 로그아웃 / 관리자 */}
            <div className="header-actions">
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="ghost">
                      관리자페이지
                    </Link>
                  )}
                  <button onClick={handleLogout}>로그아웃</button>
                </>
              ) : (
                <>
                  <button className="ghost" onClick={handleSignup}>
                    회원가입
                  </button>
                  <button onClick={handleLogin}>로그인</button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ===== 왼쪽 슬라이드 패널 ===== */}
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
            <li>
              <Link to="/notice" onClick={closeMenu}>
                공지사항
              </Link>
            </li>

            {/* 🔥 담양군 지부 드롭다운 (health-journal 카테고리 연결) */}
            <li className={`has-sub ${damyangOpen ? "open" : ""}`}>
              <button
                type="button"
                className="side-sub-toggle"
                onClick={() => setDamyangOpen((prev) => !prev)}
              >
                <span>담양군 지부</span>
                <span className="caret">{damyangOpen ? "▲" : "▼"}</span>
              </button>
              <ul className="side-submenu">
                {damyangCategory ? (
                  <li>
                    {/* 여기서는 기존처럼 /damyang-health-journal 로 이동하고,
                        페이지 안에서 category='health-journal'로 조회 */}
                    <Link to="/damyang-health-journal" onClick={closeMenu}>
                      ㆍ{damyangCategory.label}
                    </Link>
                  </li>
                ) : (
                  <li>
                    <span className="side-submenu-empty">
                      등록된 카테고리가 없습니다.
                    </span>
                  </li>
                )}
              </ul>
            </li>

            {/* 🔥 나머지 프로그램 카테고리는 전부 동적으로 노출 */}
            {otherCategories.map((cat) => (
              <li key={cat.slug}>
                {/* /program/:slug 라우트로 이동하도록 설계 */}
                <Link
                  to={`/program/${cat.slug}`}
                  onClick={closeMenu}
                >
                  {cat.label}
                </Link>
              </li>
            ))}

            {/* 🔥 관리자 전용 메뉴 */}
            {isAdmin && (
              <li>
                <Link to="/admin" onClick={closeMenu}>
                  관리자 페이지
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
}
