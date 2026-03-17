// src/components/LatestNewsTicker.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./LatestNewsTicker.css";

export default function LatestNewsTicker() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatest = async () => {
      const { data, error } = await supabase
        .from("notices")
        .select("id, title, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        setPosts(data);
      }
    };

    fetchLatest();
  }, []);

  if (posts.length === 0) return null;

  // 티커가 끊기지 않게 두 번 복사
  const tickerItems = [...posts, ...posts];

  return (
    <div className="ticker-wrap">
      <div className="ticker-label">최신 공지</div>
      <div className="ticker-track-outer">
        <div className="ticker-track" style={{ "--count": posts.length }}>
          {tickerItems.map((post, idx) => (
            <button
              key={`${post.id}-${idx}`}
              className="ticker-item"
              onClick={() => navigate(`/notice/${post.id}`)}
            >
              <span className="ticker-dot">●</span>
              {post.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
