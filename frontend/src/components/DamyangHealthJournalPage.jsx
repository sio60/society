// src/components/DamyangHealthJournalPage.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./DamyangHealthJournalPage.css";

const CATEGORY_ID = "health-journal";

export default function DamyangHealthJournalPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("program_posts")
        .select("id, title, content, image_url, created_at")
        .eq("category", CATEGORY_ID)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setErrorMsg("프로그램 글을 불러오는 중 오류가 발생했습니다.");
        setPosts([]);
      } else {
        setPosts(data || []);
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <main className="journal-page">
      <div className="journal-inner">
        <h1>담양군 건강증진 일지</h1>

        <section className="journal-section">
          {loading && <p>불러오는 중입니다...</p>}
          {errorMsg && <p className="journal-error">{errorMsg}</p>}

          {!loading && !errorMsg && posts.length === 0 && (
            <p>아직 등록된 글이 없습니다. 관리자 페이지에서 글을 등록해 주세요.</p>
          )}

          {!loading && !errorMsg && posts.length > 0 && (
            <ul className="journal-list">
              {posts.map((post) => (
                <li key={post.id} className="journal-item">
                  <div className="journal-text">
                    <h2>{post.title}</h2>
                    <p className="journal-date">
                      {new Date(post.created_at).toLocaleDateString("ko-KR")}
                    </p>
                    <div
                      className="journal-content"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </div>
                  {post.image_url && (
                    <div className="journal-thumb-wrap">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="journal-thumb"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
