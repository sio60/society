// src/components/NoticePage.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./NoticePage.css";

export default function NoticePage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMsg("");

      // 1) 현재 로그인 유저 → admin 여부 확인
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email;
      setIsAdmin(email === "admin@icocm.org");

      // 2) 공지 목록 불러오기
      const { data, error } = await supabase
        .from("notices")
        .select("id, title, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setErrorMsg("공지 정보를 불러오는 중 오류가 발생했습니다.");
      } else {
        setNotices(data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("ko-KR");
  };

  // 🔥 삭제 처리
  const handleDelete = async (id) => {
    const ok = window.confirm("정말 이 공지를 삭제하시겠습니까?");
    if (!ok) return;

    const { error } = await supabase.from("notices").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("삭제 중 오류가 발생했습니다.");
      return;
    }

    // 화면에서도 즉시 제거
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <main className="notice-page">
      <div className="notice-inner">
        {/* 상단 제목 + 관리자 전용 버튼 */}
        <div className="notice-header-row">
          <div>
            <h1 className="notice-title">공지사항</h1>
            <p className="notice-subtitle">
              국제융합의학학회의 주요 소식을 이곳에서 안내합니다.
            </p>
          </div>
        </div>

        {/* 내용 영역 */}
        {loading ? (
          <div className="notice-empty">
            <p>공지사항을 불러오는 중입니다…</p>
          </div>
        ) : errorMsg ? (
          <div className="notice-empty">
            <p>{errorMsg}</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="notice-empty">
            <p>현재 등록된 공지사항이 없습니다.</p>
            <p className="notice-empty-sub">
              관리자가 공지를 등록하면 이곳에 목록이 표시됩니다.
            </p>
          </div>
        ) : (
          <ul className="notice-list">
            {notices.map((notice, idx) => {
              const no = notices.length - idx; // 최신 글이 1번처럼 보이게
              const date = formatDate(notice.created_at);

              return (
                <li key={notice.id}>
                  <Link
                    to={`/notice/${notice.id}`}
                    className="notice-row-link"
                  >
                    <span className="notice-no">{no}</span>
                    <span className="notice-row-title">{notice.title}</span>
                    <span className="notice-row-date">{date}</span>

                    {/* 🔥 관리자만 보는 삭제 버튼 */}
                    {isAdmin && (
                      <button
                        className="notice-delete-btn"
                        onClick={(e) => {
                          e.preventDefault(); // 상세페이지 이동 막기
                          e.stopPropagation();
                          handleDelete(notice.id);
                        }}
                      >
                        삭제
                      </button>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
