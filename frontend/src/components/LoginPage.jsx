// src/components/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./Auth.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      let loginId = form.username.trim();

      // 🔹 admin 계정은 아이디만으로 로그인 허용
      //    (admin → admin@icocm.org 로 변환)
      if (loginId === "admin") {
        loginId = "admin@icocm.org";
      } else if (!loginId.includes("@")) {
        // 그 외 일반 회원은 이메일 형식 강제
        setErrorMsg(
          "아이디는 이메일 형식으로 입력해 주세요. (또는 관리자 계정은 admin)"
        );
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: loginId,
        password: form.password,
      });

      if (error) {
        throw error;
      }

      // 로그인 성공 → 메인으로
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">로그인</h1>
        <p className="auth-subtitle">
          ICoCM 회원 서비스를 이용하시려면 아이디와 비밀번호를 입력해 주세요.
        </p>

        {errorMsg && <div className="auth-error">{errorMsg}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>아이디</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="예: user@example.com"
              required
            />
          </div>

          <div className="auth-field">
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="auth-button primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="auth-footer-text">
          아직 회원이 아니신가요?{" "}
          <Link to="/signup" className="auth-link">
            회원가입 하러 가기
          </Link>
        </p>
      </div>
    </main>
  );
}
