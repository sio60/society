// src/components/auth/LoginForm.jsx
import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./AuthForm.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setUserInfo(null);

    if (!email || !password) {
      setErrorMsg("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      // 로그인 성공
      setUserInfo(data.user);
    } catch (err) {
      console.error(err);
      setErrorMsg("알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <h2 className="auth-title">로그인</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          이메일
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {errorMsg && <p className="auth-error">{errorMsg}</p>}

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      {userInfo && (
        <p className="auth-success">
          {userInfo.email} 계정으로 로그인되었습니다.
        </p>
      )}
    </div>
  );
}
