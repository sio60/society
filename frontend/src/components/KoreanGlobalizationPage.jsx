import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./KoreanGlobalizationPage.css";

const CATEGORY_ID = "korean-globalization";

export default function KoreanGlobalizationPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("program_posts")
        .select("id, title, content, image_url, image_urls, created_at")
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
    <main className="global-page">
      <div className="global-inner">
        <h1 className="global-title">한국어 세계화 사업</h1>

        {loading && <p>불러오는 중입니다...</p>}
        {errorMsg && <p className="global-error">{errorMsg}</p>}

        {!loading && !errorMsg && posts.length === 0 && (
          <p>아직 등록된 글이 없습니다. 관리자 페이지에서 글을 등록해 주세요.</p>
        )}

        {!loading && !errorMsg && posts.length > 0 && (
          <ul className="global-post-list">
            {posts.map((post) => {
              const allImages =
                Array.isArray(post.image_urls) && post.image_urls.length > 0
                  ? post.image_urls
                  : post.image_url
                  ? [post.image_url]
                  : [];

              return (
                <li key={post.id} className="global-post-item">
                  <h2 className="global-post-title">{post.title}</h2>
                  <p className="global-post-date">
                    {new Date(post.created_at).toLocaleDateString("ko-KR")}
                  </p>

                  <div
                    className="global-post-content"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  {allImages.length > 0 && (
                    <div className="global-gallery">
                      {allImages.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`${post.title} 이미지 ${idx + 1}`}
                          className="global-image"
                        />
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
