import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./NoticePage.css"; // 같은 스타일 파일 재사용

export default function NoticeDetailPage() {
  const { noticeId } = useParams();
  const navigate = useNavigate();

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchNotice = async () => {
      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("notices")
        .select("id, title, content, image_url, created_at")
        .eq("id", noticeId)
        .single();

      if (error) {
        console.error(error);
        setErrorMsg("공지 정보를 불러오는 중 오류가 발생했습니다.");
      } else {
        setNotice(data);
      }

      setLoading(false);
    };

    fetchNotice();
  }, [noticeId]);

  const formatDateTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const date = d.toLocaleDateString("ko-KR");
    const time = d.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  };

  if (loading) {
    return (
      <main className="notice-page">
        <div className="notice-inner">
          <p className="notice-empty">공지사항을 불러오는 중입니다…</p>
        </div>
      </main>
    );
  }

  if (!notice || errorMsg) {
    return (
      <main className="notice-page">
        <div className="notice-inner">
          <p className="notice-empty">
            {errorMsg || "존재하지 않는 공지입니다."}
          </p>
          <button
            className="notice-back-btn"
            onClick={() => navigate("/notice")}
          >
            ← 공지 목록으로
          </button>
        </div>
      </main>
    );
  }

  const { date, time } = formatDateTime(notice.created_at);

  return (
    <main className="notice-page">
      <div className="notice-inner">
        <button
          className="notice-back-btn"
          onClick={() => navigate("/notice")}
        >
          ← 공지 목록으로
        </button>

        <article className="notice-detail-card">
          <h1 className="notice-detail-title">{notice.title}</h1>
          <div className="notice-detail-meta">
            <span>{date}</span>
            <span className="dot">·</span>
            <span>{time}</span>
          </div>

          {notice.image_url && (
            <div className="notice-detail-image">
              <img src={notice.image_url} alt={notice.title} />
            </div>
          )}

          <div className="notice-detail-content">
            {notice.content?.split("\n").map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
