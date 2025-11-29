// src/components/AdminPage.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./AdminPage.css";

// 🔔 SMS 워커 주소 (.env에 VITE_SMS_API_URL 로 넣어둔 값)
const SMS_API_URL = import.meta.env.VITE_SMS_API_URL;

// ReactQuill 툴바 옵션
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "align",
  "list",
  "bullet",
  "link",
];

// 카테고리 slug 자동 생성용
const generateCategorySlug = (label) => {
  let base = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!base) base = "category";
  return `${base}-${Date.now()}`;
};

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState(null);

  // ---------- 프로그램 카테고리 ----------
  const [programCategories, setProgramCategories] = useState([]); // {id, slug, label, sort_order}[]
  const [programCategory, setProgramCategory] = useState(""); // 선택된 slug
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState("");
  const [categoryFormLabel, setCategoryFormLabel] = useState("");
  const [categorySaving, setCategorySaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // {id, slug, label, sort_order} | null

  // ---------- 공지 작성 ----------
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // ReactQuill HTML
  const [noticeImageFile, setNoticeImageFile] = useState(null);
  const [savingNotice, setSavingNotice] = useState(false);
  const [noticeError, setNoticeError] = useState("");

  // ---------- 회원 목록 ----------
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [membersError, setMembersError] = useState("");

  // 🔔 문자 발송용 상태
  const [selectedMemberIds, setSelectedMemberIds] = useState([]); // 체크된 회원 id[]
  const [smsText, setSmsText] = useState("");
  const [smsSending, setSmsSending] = useState(false);
  const [smsError, setSmsError] = useState("");

  // ---------- 프로그램 콘텐츠(카테고리별 글 + 이미지 여러 장) ----------
  const [programTitle, setProgramTitle] = useState("");
  const [programContent, setProgramContent] = useState(""); // ReactQuill HTML
  const [programImageFiles, setProgramImageFiles] = useState([]); // File[]
  const [programImageUrls, setProgramImageUrls] = useState([]); // string[]
  const [editingProgramId, setEditingProgramId] = useState(null); // 수정 중인 글 id
  const [savingProgram, setSavingProgram] = useState(false);
  const [programError, setProgramError] = useState("");
  const [programPosts, setProgramPosts] = useState([]);
  const [programLoading, setProgramLoading] = useState(false);

  // ---------- 로그인한 유저 정보 ----------
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setCurrentUser(data.session?.user ?? null);
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null);
      }
    );

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const isAdmin = currentUser?.email === "admin@icocm.org";

  // ---------- 회원 목록 불러오기 ----------
  useEffect(() => {
    if (!isAdmin) return;

    const fetchMembers = async () => {
      setMembersLoading(true);
      setMembersError("");

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, name, phone, birthdate, birth_place, residence, health_goal, username, created_at"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setMembersError("회원 목록을 불러오는 중 오류가 발생했습니다.");
        setMembers([]);
      } else {
        setMembers(data || []);
      }

      setMembersLoading(false);
    };

    fetchMembers();
  }, [isAdmin]);

  // ---------- 프로그램 카테고리 목록 불러오기 ----------
  const fetchCategories = async () => {
    setCategoryLoading(true);
    setCategoryError("");

    const { data, error } = await supabase
      .from("program_categories")
      .select("id, slug, label, sort_order")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error(error);
      setCategoryError("카테고리 목록을 불러오는 중 오류가 발생했습니다.");
      setProgramCategories([]);
    } else {
      const list = data || [];
      setProgramCategories(list);

      // 아직 선택된 카테고리가 없으면 첫 번째 것으로 설정
      if (!programCategory && list.length > 0) {
        setProgramCategory(list[0].slug);
      }
    }

    setCategoryLoading(false);
  };

  useEffect(() => {
    if (!isAdmin) return;
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  // ---------- 카테고리 저장 / 수정 ----------
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryFormLabel.trim()) {
      alert("카테고리 이름을 입력해 주세요.");
      return;
    }

    try {
      setCategorySaving(true);

      if (editingCategory) {
        // 이름만 수정
        const { error } = await supabase
          .from("program_categories")
          .update({ label: categoryFormLabel.trim() })
          .eq("id", editingCategory.id);

        if (error) throw error;
      } else {
        // 새 카테고리 추가
        const sortOrder =
          programCategories.length > 0
            ? Math.max(
                ...programCategories.map((c) => c.sort_order ?? 0)
              ) + 1
            : 1;

        const slug = generateCategorySlug(categoryFormLabel);

        const { error } = await supabase.from("program_categories").insert({
          slug,
          label: categoryFormLabel.trim(),
          sort_order: sortOrder,
        });

        if (error) throw error;
      }

      setCategoryFormLabel("");
      setEditingCategory(null);
      await fetchCategories();
    } catch (err) {
      console.error(err);
      alert("카테고리 저장 중 오류가 발생했습니다.");
    } finally {
      setCategorySaving(false);
    }
  };

  const handleEditCategoryClick = (cat) => {
    setEditingCategory(cat);
    setCategoryFormLabel(cat.label);
  };

  const handleCancelCategoryEdit = () => {
    setEditingCategory(null);
    setCategoryFormLabel("");
  };

  const handleDeleteCategory = async (cat) => {
    if (
      !window.confirm(
        `"${cat.label}" 카테고리를 삭제하시겠습니까?\n(연결된 프로그램 글은 그대로 남아 있습니다.)`
      )
    )
      return;

    try {
      const { error } = await supabase
        .from("program_categories")
        .delete()
        .eq("id", cat.id);

      if (error) throw error;

      if (programCategory === cat.slug) {
        setProgramCategory("");
      }

      await fetchCategories();
    } catch (err) {
      console.error(err);
      alert("카테고리 삭제 중 오류가 발생했습니다.");
    }
  };

  // ---------- 프로그램 글 목록 불러오기 ----------
  const fetchProgramPosts = async (categorySlug) => {
    if (!categorySlug) return;

    setProgramLoading(true);
    setProgramError("");

    const { data, error } = await supabase
      .from("program_posts")
      .select("id, title, content, image_url, image_urls, created_at")
      .eq("category", categorySlug)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setProgramError("프로그램 글을 불러오는 중 오류가 발생했습니다.");
      setProgramPosts([]);
    } else {
      setProgramPosts(data || []);
    }

    setProgramLoading(false);
  };

  useEffect(() => {
    if (!isAdmin) return;
    if (!programCategory) return;
    fetchProgramPosts(programCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, programCategory]);

  // ---------- 공지사항 저장 + 이미지 업로드 ----------
  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    setNoticeError("");

    if (!title.trim()) {
      setNoticeError("제목을 입력해 주세요.");
      return;
    }

    if (!content || content.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
      setNoticeError("내용을 입력해 주세요.");
      return;
    }

    try {
      setSavingNotice(true);

      let imageUrl = null;

      if (noticeImageFile) {
        const fileExt = noticeImageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `notice-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("notice-images")
          .upload(filePath, noticeImageFile);

        if (uploadError) {
          console.error(uploadError);
          throw new Error(
            `이미지 업로드 중 오류가 발생했습니다: ${uploadError.message}`
          );
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("notice-images").getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error: insertError } = await supabase.from("notices").insert({
        title: title.trim(),
        content,
        image_url: imageUrl,
      });

      if (insertError) {
        console.error(insertError);
        throw new Error("공지 저장 중 오류가 발생했습니다.");
      }

      alert("공지사항이 등록되었습니다.");
      setTitle("");
      setContent("");
      setNoticeImageFile(null);
    } catch (err) {
      console.error(err);
      setNoticeError(err.message || "공지 저장 중 오류가 발생했습니다.");
    } finally {
      setSavingNotice(false);
    }
  };

  // ---------- 프로그램 글 저장/수정 + 이미지 업로드 ----------
  const handleProgramSubmit = async (e) => {
    e.preventDefault();
    setProgramError("");

    if (!programCategory) {
      setProgramError("먼저 프로그램 카테고리를 선택해 주세요.");
      return;
    }

    if (!programTitle.trim()) {
      setProgramError("프로그램 제목을 입력해 주세요.");
      return;
    }

    if (
      !programContent ||
      programContent.replace(/<(.|\n)*?>/g, "").trim().length === 0
    ) {
      setProgramError("내용을 입력해 주세요.");
      return;
    }

    try {
      setSavingProgram(true);

      // 1) 기존 이미지 URL들 (수정 모드일 때)
      let imageUrls = [...programImageUrls];

      // 2) 새로 선택한 파일들 업로드
      if (programImageFiles && programImageFiles.length > 0) {
        const uploadResults = await Promise.all(
          programImageFiles.map(async (file) => {
            const fileExt = file.name.split(".").pop();
            const fileName = `${programCategory}-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}.${fileExt}`;
            const filePath = `${programCategory}/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from("program-images")
              .upload(filePath, file);

            if (uploadError) {
              console.error(uploadError);
              throw new Error(
                `이미지 업로드 중 오류가 발생했습니다: ${uploadError.message}`
              );
            }

            const {
              data: { publicUrl },
            } = supabase.storage
              .from("program-images")
              .getPublicUrl(filePath);

            return publicUrl;
          })
        );

        imageUrls = [...imageUrls, ...uploadResults];
      }

      // 대표 이미지(썸네일)는 첫 번째 이미지
      const imageUrl = imageUrls.length > 0 ? imageUrls[0] : null;

      if (editingProgramId) {
        const { error: updateError } = await supabase
          .from("program_posts")
          .update({
            category: programCategory,
            title: programTitle.trim(),
            content: programContent,
            image_url: imageUrl,
            image_urls: imageUrls,
          })
          .eq("id", editingProgramId);

        if (updateError) {
          console.error(updateError);
          throw new Error("프로그램 글 수정 중 오류가 발생했습니다.");
        }
      } else {
        const { error: insertError } = await supabase
          .from("program_posts")
          .insert({
            category: programCategory,
            title: programTitle.trim(),
            content: programContent,
            image_url: imageUrl,
            image_urls: imageUrls,
          });

        if (insertError) {
          console.error(insertError);
          throw new Error("프로그램 글 저장 중 오류가 발생했습니다.");
        }
      }

      resetProgramForm();
      await fetchProgramPosts(programCategory);
    } catch (err) {
      console.error(err);
      setProgramError(err.message || "프로그램 글 저장 중 오류가 발생했습니다.");
    } finally {
      setSavingProgram(false);
    }
  };

  const handleDeleteProgramPost = async (id) => {
    if (!window.confirm("이 글을 삭제하시겠습니까?")) return;

    const { error } = await supabase
      .from("program_posts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("삭제 중 오류가 발생했습니다.");
      return;
    }

    await fetchProgramPosts(programCategory);
  };

  // 수정 버튼 클릭 시: 폼에 값 채워넣기
  const handleEditProgramPost = (post) => {
    setProgramTitle(post.title || "");
    setProgramContent(post.content || "");

    const urls =
      Array.isArray(post.image_urls) && post.image_urls.length > 0
        ? post.image_urls
        : post.image_url
        ? [post.image_url]
        : [];

    setProgramImageUrls(urls);
    setProgramImageFiles([]);
    setEditingProgramId(post.id);
  };

  const resetProgramForm = () => {
    setProgramTitle("");
    setProgramContent("");
    setProgramImageFiles([]);
    setProgramImageUrls([]);
    setEditingProgramId(null);
  };

  const handleCancelEditProgram = () => {
    resetProgramForm();
  };

  // ---------- 문자 발송 관련 핸들러 ----------
  const toggleMemberSelect = (memberId) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAllMembers = (checked) => {
    if (checked) {
      setSelectedMemberIds(members.map((m) => m.id));
    } else {
      setSelectedMemberIds([]);
    }
  };

  const handleSendSms = async () => {
    setSmsError("");

    if (!SMS_API_URL) {
      setSmsError("문자 발송 API 주소가 설정되어 있지 않습니다.");
      return;
    }

    if (!smsText.trim()) {
      setSmsError("보낼 문자 내용을 입력해 주세요.");
      return;
    }

    if (selectedMemberIds.length === 0) {
      setSmsError("문자를 보낼 회원을 선택해 주세요.");
      return;
    }

    const targets = members.filter(
      (m) => selectedMemberIds.includes(m.id) && m.phone
    );

    if (targets.length === 0) {
      setSmsError("선택한 회원 중 등록된 전화번호가 없습니다.");
      return;
    }

    const phones = targets
      .map((m) => m.phone.replace(/[^0-9]/g, "")) // 숫자만 추출
      .filter(Boolean);

    try {
      setSmsSending(true);

      const res = await fetch(SMS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phones, text: smsText }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        console.error("SMS ERROR:", json);
        throw new Error(json?.error || "sms_failed");
      }

      alert(`총 ${phones.length}명에게 문자 발송 요청이 전송되었습니다.`);
      // 필요하면 setSmsText(""); 로 내용 초기화 가능
    } catch (err) {
      console.error(err);
      setSmsError(err.message || "문자 발송 중 오류가 발생했습니다.");
    } finally {
      setSmsSending(false);
    }
  };

  // ---------- 권한 체크 ----------
  if (!currentUser) {
    return (
      <main className="admin-page">
        <div className="admin-inner">
          <h1 className="admin-title">관리자 페이지</h1>
          <p>관리자 로그인이 필요합니다.</p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="admin-page">
        <div className="admin-inner">
          <h1 className="admin-title">관리자 페이지</h1>
          <p>접근 권한이 없습니다.</p>
        </div>
      </main>
    );
  }

  // ---------- 실제 화면 ----------
  return (
    <main className="admin-page">
      <div className="admin-inner">
        <h1 className="admin-title">관리자 페이지</h1>

        {/* ✅ 프로그램 카테고리 관리 섹션 */}
        {/* (여기부터 프로그램 섹션까지는 네가 주던 코드랑 동일) */}
        <section className="admin-section">
          <h2 className="admin-section-title">프로그램 카테고리 관리</h2>
          <p className="admin-section-desc">
            햄버거 메뉴와 &ldquo;프로그램&rdquo; 페이지에 사용되는 카테고리를
            추가·수정·삭제합니다.
          </p>

          {categoryError && <div className="admin-error">{categoryError}</div>}

          <form className="notice-form" onSubmit={handleSaveCategory}>
            <div className="form-row">
              <label>카테고리 이름</label>
              <input
                type="text"
                value={categoryFormLabel}
                onChange={(e) => setCategoryFormLabel(e.target.value)}
                placeholder="예: 걷기·숲 명상"
              />
            </div>

            <div className="form-row form-row-inline">
              <button
                type="submit"
                className="admin-primary-btn"
                disabled={categorySaving}
              >
                {categorySaving
                  ? "저장 중..."
                  : editingCategory
                  ? "카테고리 수정"
                  : "카테고리 추가"}
              </button>

              {editingCategory && (
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={handleCancelCategoryEdit}
                >
                  수정 취소
                </button>
              )}
            </div>
          </form>

          <div className="admin-program-list">
            <h3 className="admin-subtitle">등록된 카테고리</h3>

            {categoryLoading ? (
              <p>불러오는 중입니다...</p>
            ) : programCategories.length === 0 ? (
              <p>등록된 카테고리가 없습니다.</p>
            ) : (
              <ul className="program-category-list">
                {programCategories.map((cat) => (
                  <li key={cat.id} className="program-category-item">
                    <span className="program-category-label">
                      {cat.label}
                    </span>
                    <div className="program-post-buttons">
                      <button
                        type="button"
                        className="admin-secondary-btn"
                        onClick={() => handleEditCategoryClick(cat)}
                      >
                        이름 수정
                      </button>
                      <button
                        type="button"
                        className="admin-secondary-btn danger"
                        onClick={() => handleDeleteCategory(cat)}
                      >
                        삭제
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* ✅ 공지 작성 섹션 */}
        <section className="admin-section">
          <h2 className="admin-section-title">공지사항 작성</h2>

          {noticeError && <div className="admin-error">{noticeError}</div>}

          <form className="notice-form" onSubmit={handleNoticeSubmit}>
            <div className="form-row">
              <label>제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="공지 제목을 입력해 주세요."
              />
            </div>

            <div className="form-row">
              <label>내용</label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                formats={quillFormats}
                placeholder="공지 내용을 입력해 주세요."
              />
            </div>

            <div className="form-row">
              <label>이미지 (선택)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNoticeImageFile(e.target.files?.[0] ?? null)
                }
              />
            </div>

            <button
              type="submit"
              className="admin-primary-btn"
              disabled={savingNotice}
            >
              {savingNotice ? "저장 중..." : "공지 등록"}
            </button>
          </form>
        </section>

        {/* ✅ 프로그램 콘텐츠 관리 섹션 */}
        <section className="admin-section">
          <h2 className="admin-section-title">프로그램 콘텐츠 관리</h2>
          <p className="admin-section-desc">
            홈페이지 상단 &ldquo;프로그램&rdquo; 코너 하위 페이지에 들어갈 글과
            사진을 등록·수정합니다.
          </p>

          <div className="form-row">
            <label>카테고리</label>
            <select
              value={programCategory}
              onChange={(e) => {
                setProgramCategory(e.target.value);
                handleCancelEditProgram();
              }}
            >
              {programCategories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {programError && <div className="admin-error">{programError}</div>}

          <form className="notice-form" onSubmit={handleProgramSubmit}>
            <div className="form-row">
              <label>제목</label>
              <input
                type="text"
                value={programTitle}
                onChange={(e) => setProgramTitle(e.target.value)}
                placeholder="프로그램 내 게시글 제목을 입력해 주세요."
              />
            </div>

            <div className="form-row">
              <label>내용</label>
              <ReactQuill
                theme="snow"
                value={programContent}
                onChange={setProgramContent}
                modules={quillModules}
                formats={quillFormats}
                placeholder="본문 내용을 입력해 주세요."
              />
            </div>

            <div className="form-row">
              <label>이미지 (선택, 여러 장 가능)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setProgramImageFiles(
                    e.target.files ? Array.from(e.target.files) : []
                  )
                }
              />
              {programImageUrls.length > 0 && (
                <>
                  <div className="admin-image-preview">
                    {programImageUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="admin-image-preview-item"
                      >
                        <img src={url} alt={`이미지 ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                  <p className="admin-help-text">
                    현재 {programImageUrls.length}장의 이미지가 등록되어
                    있습니다. 새 파일을 선택하면 이미지가 추가로 업로드됩니다.
                    (기존 이미지는 그대로 유지됩니다.)
                  </p>
                </>
              )}
            </div>

            <div className="form-row form-row-inline">
              <button
                type="submit"
                className="admin-primary-btn"
                disabled={savingProgram}
              >
                {savingProgram
                  ? "저장 중..."
                  : editingProgramId
                  ? "프로그램 글 수정"
                  : "프로그램 글 등록"}
              </button>

              {editingProgramId && (
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={handleCancelEditProgram}
                >
                  수정 취소
                </button>
              )}
            </div>
          </form>

          <div className="admin-program-list">
            <h3 className="admin-subtitle">등록된 글</h3>

            {programLoading ? (
              <p>불러오는 중입니다...</p>
            ) : programPosts.length === 0 ? (
              <p>이 카테고리에 등록된 글이 없습니다.</p>
            ) : (
              <ul className="program-post-list">
                {programPosts.map((post) => {
                  const imageUrls =
                    Array.isArray(post.image_urls) &&
                    post.image_urls.length > 0
                      ? post.image_urls
                      : post.image_url
                      ? [post.image_url]
                      : [];
                  const thumbUrl = imageUrls[0] || null;

                  return (
                    <li key={post.id} className="program-post-item">
                      <div className="program-post-main">
                        <h4>{post.title}</h4>
                        <p className="program-post-date">
                          {new Date(
                            post.created_at
                          ).toLocaleDateString("ko-KR")}
                        </p>
                        <div
                          className="program-post-content"
                          dangerouslySetInnerHTML={{
                            __html:
                              post.content.length > 200
                                ? post.content.slice(0, 200) + "..."
                                : post.content,
                          }}
                        />
                      </div>
                      <div className="program-post-side">
                        {thumbUrl && (
                          <img
                            src={thumbUrl}
                            alt={post.title}
                            className="program-post-thumb"
                          />
                        )}
                        {imageUrls.length > 1 && (
                          <p className="admin-help-text">
                            총 {imageUrls.length}장 등록됨
                          </p>
                        )}
                        <div className="program-post-buttons">
                          <button
                            type="button"
                            className="admin-secondary-btn"
                            onClick={() => handleEditProgramPost(post)}
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            className="admin-secondary-btn danger"
                            onClick={() => handleDeleteProgramPost(post.id)}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        {/* ✅ 회원 목록 섹션 + 문자 발송 UI */}
        <section className="admin-section">
          <h2 className="admin-section-title">회원 목록</h2>
          <p className="admin-section-desc">
            등록된 회원 정보를 확인하고, 선택한 회원에게 안내 문자를 발송할 수
            있습니다.
          </p>

          {/* 문자 관련 에러 */}
          {smsError && <div className="admin-error">{smsError}</div>}

          {/* 문자 내용 입력 + 발송 버튼 */}
          <div className="notice-form" style={{ marginBottom: 16 }}>
            <div className="form-row">
              <label>문자 내용</label>
              <textarea
                rows={3}
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
                placeholder="보낼 문자 내용을 입력해 주세요."
              />
              <p className="admin-help-text">
                예) ICoCM 건강증진회 프로그램 안내입니다. 신청 링크:
                https://icocm.org/...
              </p>
            </div>
            <div className="form-row form-row-inline">
              <button
                type="button"
                className="admin-primary-btn"
                onClick={handleSendSms}
                disabled={
                  smsSending || membersLoading || members.length === 0
                }
              >
                {smsSending ? "발송 중..." : "선택 회원에게 문자 보내기"}
              </button>
            </div>
          </div>

          {membersError && <div className="admin-error">{membersError}</div>}

          {membersLoading ? (
            <p>회원 목록을 불러오는 중입니다...</p>
          ) : members.length === 0 ? (
            <p>등록된 회원이 없습니다.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleSelectAllMembers(e.target.checked)
                        }
                        checked={
                          members.length > 0 &&
                          selectedMemberIds.length === members.length
                        }
                      />
                    </th>
                    <th>이름</th>
                    <th>아이디(이메일)</th>
                    <th>전화번호</th>
                    <th>생년월일</th>
                    <th>탄생지</th>
                    <th>주거지</th>
                    <th>건강 목표</th>
                    <th>가입일</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedMemberIds.includes(m.id)}
                          onChange={() => toggleMemberSelect(m.id)}
                        />
                      </td>
                      <td>{m.name || "-"}</td>
                      <td>{m.username}</td>
                      <td>{m.phone || "-"}</td>
                      <td>{m.birthdate || "-"}</td>
                      <td>{m.birth_place || "-"}</td>
                      <td>{m.residence || "-"}</td>
                      <td>{m.health_goal || "-"}</td>
                      <td>
                        {m.created_at
                          ? new Date(m.created_at).toLocaleDateString("ko-KR")
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
