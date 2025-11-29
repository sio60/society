// src/components/WalkingMeditationPage.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./WalkingMeditationPage.css";

export default function WalkingMeditationPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // 갤러리 모달용
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("program_posts")
        .select("id, title, content, image_urls, created_at")
        .eq("category", "walking-meditation")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(); // 가장 최신 글 하나

      if (error) {
        console.error(error);
        setErrorMsg("프로그램 정보를 불러오는 중 오류가 발생했습니다.");
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, []);

  const images = Array.isArray(post?.image_urls) ? post.image_urls : [];

  const openModal = (index) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  if (loading) {
    return (
      <main className="walk-page">
        <div className="walk-inner">
          <p>걷기·숲 명상 정보를 불러오는 중입니다...</p>
        </div>
      </main>
    );
  }

  if (errorMsg) {
    return (
      <main className="walk-page">
        <div className="walk-inner">
          <p>{errorMsg}</p>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="walk-page">
        <div className="walk-inner">
          <p>등록된 걷기·숲 명상 프로그램이 없습니다.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="walk-page">
      <div className="walk-inner">
        {/* 상단 소개/본문 영역 – 관리자 페이지에서 입력한 내용 */}
        <section className="walk-hero">
          <h1>{post.title || "걷기·숲 명상"}</h1>
          <div
            className="walk-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </section>

        {/* 이미지가 한 장 이상 있을 때만 갤러리 노출 */}
        {images.length > 0 && (
          <section className="walk-gallery-section">
            <h2>프로그램 갤러리</h2>
            <p className="walk-gallery-caption">
              총 <strong>{images.length}</strong>장 등록됨 · 이미지를 클릭하면
              크게 보실 수 있습니다.
            </p>

            <div className="walk-gallery">
              {images.map((url, index) => (
                <button
                  key={index}
                  type="button"
                  className="walk-gallery-item"
                  onClick={() => openModal(index)}
                >
                  <img
                    src={url}
                    alt={`걷기·숲 명상 사진 ${index + 1}`}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 미리보기 모달 */}
      {selectedIndex !== null && images[selectedIndex] && (
        <div className="walk-modal-backdrop" onClick={closeModal}>
          <div
            className="walk-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="walk-modal-close"
              onClick={closeModal}
              aria-label="닫기"
            >
              ×
            </button>
            <img
              src={images[selectedIndex]}
              alt={`걷기·숲 명상 사진 ${selectedIndex + 1}`}
              className="walk-modal-image"
            />
            <p className="walk-modal-caption">
              걷기·숲 명상 사진 {selectedIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
