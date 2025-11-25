import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AuthPage.css";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    birthDate: "",
    birthPlace: "",
    address: "",
    healthGoal: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.username || !form.password) {
      setError("필수 항목을 모두 입력해 주세요.");
      return;
    }

    if (form.password.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    // 👉 나중에 여기서 Supabase로 회원가입 API 호출
    console.log("signup form:", form);
    alert("아직 서버와 연결 전입니다. (프론트 폼만 완료!)");
  };

  return (
    <section className="auth-page">
      <div className="auth-inner">
        <h1 className="auth-title">회원가입</h1>
        <p className="auth-subtitle">
          ICoCM 온라인 서비스를 이용하시려면 기본 정보를 입력해 주세요.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="name">
              이름 *
            </label>
            <input
              id="name"
              name="name"
              className="auth-input"
              placeholder="홍길동"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="phone">
              연락처(휴대폰) *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="auth-input"
              placeholder="010-0000-0000"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="birthDate">
              생년월일
            </label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              className="auth-input"
              value={form.birthDate}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="birthPlace">
              탄생지
            </label>
            <input
              id="birthPlace"
              name="birthPlace"
              className="auth-input"
              placeholder="예: 전남 담양군"
              value={form.birthPlace}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="address">
              주거지
            </label>
            <input
              id="address"
              name="address"
              className="auth-input"
              placeholder="예: 광주광역시 ○○구 ○○동"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="healthGoal">
              건강의 목표
            </label>
            <textarea
              id="healthGoal"
              name="healthGoal"
              className="auth-textarea"
              placeholder="예: 만성 피로 개선, 마음 건강 관리 등"
              value={form.healthGoal}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="username">
              아이디 *
            </label>
            <input
              id="username"
              name="username"
              className="auth-input"
              placeholder="로그인에 사용할 아이디"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              비밀번호 *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="auth-input"
              placeholder="영문, 숫자 포함 8자 이상"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="confirmPassword">
              비밀번호 확인 *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="auth-input"
              placeholder="비밀번호를 한 번 더 입력하세요"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-button-main">
            회원가입 완료
          </button>
        </form>

        <div className="auth-bottom">
          이미 계정이 있으신가요?{" "}
          <Link to="/login">로그인 하러 가기</Link>
        </div>
      </div>
    </section>
  );
}
