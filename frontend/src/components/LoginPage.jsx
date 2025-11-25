import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AuthPage.css";

export default function LoginPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setError("아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    // 👉 나중에 Supabase 로그인 API 호출 자리
    console.log("login form:", form);
    alert("아직 서버와 연결 전입니다. (프론트 폼만 완료!)");
  };

  return (
    <section className="auth-page">
      <div className="auth-inner">
        <h1 className="auth-title">로그인</h1>
        <p className="auth-subtitle">
          ICoCM 회원 서비스를 이용하시려면 아이디와 비밀번호를 입력해 주세요.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="username">
              아이디
            </label>
            <input
              id="username"
              name="username"
              className="auth-input"
              placeholder="가입하신 아이디"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="auth-input"
              placeholder="비밀번호"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-button-main">
            로그인
          </button>
        </form>

        <div className="auth-bottom">
          아직 회원이 아니신가요?{" "}
          <Link to="/signup">회원가입 하러 가기</Link>
        </div>
      </div>
    </section>
  );
}
