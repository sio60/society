import React from "react";
import "./Footer.css";
import bandIcon from "../assets/band.png";

export default function Footer() {
  return (
    <footer id="footer" className="site-footer">
      <div className="footer-inner">
        {/* 공지 박스 */}
        <div className="footer-notice">
          <p className="footer-notice-title">
            (사)국제융합의학학회 ICoCM 홈페이지 안내
          </p>
          <p>
            (사)국제융합의학학회 ICoCM 홈페이지는 현재 구축 작업이 진행 중입니다.
            보다 나은 정보 제공과 안정된 서비스를 위해 준비 중이오니
            잠시만 기다려 주시면 감사하겠습니다.
          </p>
          <p>
            관련 문의는 아래 연락처로 문의해 주시기 바랍니다.&nbsp;
            <span className="footer-phone">☎ 050-5055-6293</span>
          </p>

          {/* 공사중 안내 박스 안 밴드 아이콘 */}
          <div className="footer-notice-band">
            <span>ICoCM 공식 밴드</span>
            <a
              href="https://www.band.us/band/57225708/post"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={bandIcon} alt="ICoCM 공식 밴드 바로가기" />
            </a>
          </div>
        </div>

        {/* 사업자/단체 정보 */}
        <div className="footer-meta">
          <p className="footer-org">
            (사)국제융합의학학회
            <span className="footer-dot">·</span>
            International Conference of Convergence Medicine
            <span className="footer-dot">·</span>
            ICoCM
          </p>
          <p>
            대표자: 회장 박명용&nbsp;&nbsp;|&nbsp;&nbsp;사업자등록번호: 470-82-00355
          </p>
          <p>홈페이지 관리책임자: 치유학박사 오준영</p>
          <p className="footer-contact">대표 문의: 050-5055-6293</p>
          <p className="footer-copy">© 2025 ICoCM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
