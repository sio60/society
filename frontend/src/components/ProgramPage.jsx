// src/components/ProgramPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./ProgramPage.css";

export default function ProgramPage() {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔍 이미지 미리보기용 상태
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        // 1) 카테고리 정보
        const { data: cat, error: catError } = await supabase
          .from("program_categories")
          .select("*")
          .eq("slug", slug)
          .maybeSingle(); // 없으면 null

        if (catError) throw catError;
        setCategory(cat);

        // 2) 해당 카테고리의 글 목록
        const { data: postsData, error: postsError } = await supabase
          .from("program_posts")
          .select("id, title, content, image_url, image_urls, created_at")
          .eq("category", slug)
          .order("created_at", { ascending: true });

        if (postsError) throw postsError;

        setPosts(postsData || []);
      } catch (err) {
        console.error(err);
        setErrorMsg("프로그램 내용을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  const pageTitle = category?.label || "프로그램";

  const openPreview = (url) => {
    setPreviewUrl(url);
  };

  const closePreview = () => {
    setPreviewUrl(null);
  };

  return (
    <main className="program-page">
      <div className="program-inner">
        <h1 className="program-title">{pageTitle}</h1>

        {errorMsg && <p className="program-error">{errorMsg}</p>}
        {loading && <p>불러오는 중입니다...</p>}

        {!loading && !errorMsg && posts.length === 0 && (
          <p>등록된 콘텐츠가 없습니다.</p>
        )}

        {!loading &&
          !errorMsg &&
          posts.map((post) => {
            const allImages =
              Array.isArray(post.image_urls) && post.image_urls.length > 0
                ? post.image_urls
                : post.image_url
                ? [post.image_url]
                : [];

            return (
              <article key={post.id} className="program-article">
                <h2 className="program-article-title">{post.title}</h2>
                {post.created_at && (
                  <p className="program-article-date">
                    {new Date(post.created_at).toLocaleDateString("ko-KR")}
                  </p>
                )}

                <div
                  className="program-article-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {allImages.length > 0 && (
                  <div className="program-image-grid">
                    {allImages.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`${post.title} 이미지 ${idx + 1}`}
                        className="program-image"
                        onClick={() => openPreview(url)} // 🔍 클릭 시 미리보기
                      />
                    ))}
                  </div>
                )}
              </article>
            );
          })}
      </div>

      {/* 🔍 이미지 미리보기 모달 */}
      {previewUrl && (
        <div
          className="program-modal-backdrop"
          onClick={closePreview}
        >
          <div
            className="program-modal"
            onClick={(e) => e.stopPropagation()} // 안쪽 클릭시 닫힘 방지
          >
            <button
              className="program-modal-close"
              onClick={closePreview}
              aria-label="미리보기 닫기"
            >
              ×
            </button>
            <img
              src={previewUrl}
              alt="선택한 이미지 미리보기"
              className="program-modal-image"
            />
          </div>
        </div>
      )}
    </main>
  );
}
