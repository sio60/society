// src/components/auth/SignupForm.jsx
import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./AuthForm.css"; // 공통 스타일 (나중에 설명)

export default function SignupForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    birthdate: "",
    birthPlace: "",
    residence: "",
    healthGoal: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const {
      name,
      phone,
      birthdate,
      birthPlace,
      residence,
      healthGoal,
      username,
      email,
      password,
      passwordConfirm,
    } = form;

    // 간단 검증
    if (!name || !username || !email || !password || !passwordConfirm) {
      setErrorMsg("필수 항목을 모두 입력해 주세요.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMsg("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      // 1) Supabase Auth에 회원 생성
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      const user = data.user;
      if (!user) {
        setErrorMsg("회원가입 처리 중 문제가 발생했습니다.");
        return;
      }

      // 2) profiles 테이블에 추가 정보 저장
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        name,
        phone,
        birthdate: birthdate || null,
        birth_place: birthPlace || null,
        residence: residence || null,
        health_goal: healthGoal || null,
        username,
      });

      if (profileError) {
        setErrorMsg("회원 기본정보 저장 중 오류가 발생했습니다: " + profileError.message);
        return;
      }

      setSuccessMsg("회원가입이 완료되었습니다. 이제 로그인해 주세요.");
      // 필요하면 여기서 form 초기화
      // setForm({...})
    } catch (err) {
      console.error(err);
      setErrorMsg("알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <h2 className="auth-title">회원가입</h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        {/* 이름 */}
        <label>
          이름
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        {/* 전화번호 */}
        <label>
          전화번호
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="010-0000-0000"
          />
        </label>

        {/* 생년월일 */}
        <label>
          생년월일
          <input
            type="date"
            name="birthdate"
            value={form.birthdate}
            onChange={handleChange}
          />
        </label>

        {/* 탄생지 */}
        <label>
          탄생지
          <input
            type="text"
            name="birthPlace"
            value={form.birthPlace}
            onChange={handleChange}
          />
        </label>

        {/* 주거지 */}
        <label>
          주거지
          <input
            type="text"
            name="residence"
            value={form.residence}
            onChange={handleChange}
          />
        </label>

        {/* 건강의 목표 */}
        <label>
          건강의 목표
          <textarea
            name="healthGoal"
            value={form.healthGoal}
            onChange={handleChange}
            rows={3}
          />
        </label>

        {/* 아이디(닉네임) */}
        <label>
          아이디
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>

        {/* 이메일 (로그인용) */}
        <label>
          이메일
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        {/* 비밀번호 */}
        <label>
          비밀번호
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        {/* 비밀번호 확인 */}
        <label>
          비밀번호 확인
          <input
            type="password"
            name="passwordConfirm"
            value={form.passwordConfirm}
            onChange={handleChange}
            required
          />
        </label>

        {errorMsg && <p className="auth-error">{errorMsg}</p>}
        {successMsg && <p className="auth-success">{successMsg}</p>}

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "처리 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
}
