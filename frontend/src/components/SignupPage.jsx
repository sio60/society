import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./Auth.css"; // 로그인 페이지랑 같이 쓰는 CSS

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    birthdate: "",
    birthPlace: "",
    residence: "",
    healthGoal: "",
    username: "",
    password: "",
    passwordConfirm: "",
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

    if (!form.username.includes("@")) {
      return setErrorMsg("아이디는 이메일 형식으로 입력해 주세요. (예: user@example.com)");
    }

    if (form.password.length < 6) {
      return setErrorMsg("비밀번호는 최소 6자 이상이어야 합니다.");
    }

    if (form.password !== form.passwordConfirm) {
      return setErrorMsg("비밀번호 확인이 일치하지 않습니다.");
    }

    setLoading(true);
    try {
      // 1) Supabase Auth 회원 생성 (email = 아이디)
      const { data, error } = await supabase.auth.signUp({
        email: form.username,
        password: form.password,
      });

      if (error) {
        throw error;
      }

      const user = data.user;
      if (!user) {
        throw new Error("회원가입에는 성공했지만 사용자 정보를 찾을 수 없습니다.");
      }

      // 2) profiles 테이블에 추가 정보 저장
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id, // auth.users(id)랑 FK
        name: form.name,
        phone: form.phone,
        birthdate: form.birthdate || null,
        birth_place: form.birthPlace || null,
        residence: form.residence || null,
        health_goal: form.healthGoal || null,
        username: form.username,
      });

      if (profileError) {
        console.error(profileError);
        throw new Error("회원 정보 저장 중 오류가 발생했습니다.");
      }

      alert("회원가입이 완료되었습니다. 로그인해 주세요.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">회원가입</h1>
        <p className="auth-subtitle">
          ICoCM 회원 서비스를 이용하기 위해 아래 정보를 입력해 주세요.
        </p>

        {errorMsg && <div className="auth-error">{errorMsg}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-grid-2">
            <div className="auth-field">
              <label>이름</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label>전화번호</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="010-0000-0000"
              />
            </div>
          </div>

          <div className="auth-grid-2">
            <div className="auth-field">
              <label>생년월일</label>
              <input
                type="date"
                name="birthdate"
                value={form.birthdate}
                onChange={handleChange}
              />
            </div>

            <div className="auth-field">
              <label>탄생지</label>
              <input
                name="birthPlace"
                value={form.birthPlace}
                onChange={handleChange}
                placeholder="예: 전남 담양군"
              />
            </div>
          </div>

          <div className="auth-field">
            <label>주거지</label>
            <input
              name="residence"
              value={form.residence}
              onChange={handleChange}
              placeholder="현재 거주 지역"
            />
          </div>

          <div className="auth-field">
            <label>건강의 목표</label>
            <textarea
              name="healthGoal"
              value={form.healthGoal}
              onChange={handleChange}
              rows={3}
              placeholder="예: 혈압 관리, 체력 회복, 생활 습관 개선 등"
            />
          </div>

          <hr className="auth-divider" />

          <div className="auth-field">
            <label>아이디 (이메일 형식)</label>
            <input
              name="username"
              type="email"
              value={form.username}
              onChange={handleChange}
              placeholder="로그인에 사용할 이메일 아이디"
              required
            />
          </div>

          <div className="auth-grid-2">
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

            <div className="auth-field">
              <label>비밀번호 확인</label>
              <input
                type="password"
                name="passwordConfirm"
                value={form.passwordConfirm}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button className="auth-button primary" type="submit" disabled={loading}>
            {loading ? "가입 처리 중..." : "회원가입"}
          </button>
        </form>

        <p className="auth-footer-text">
          이미 회원이신가요?{" "}
          <Link to="/login" className="auth-link">
            로그인하기
          </Link>
        </p>
      </div>
    </main>
  );
}
