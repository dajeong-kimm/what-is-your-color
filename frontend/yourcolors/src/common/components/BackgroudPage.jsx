import React, { useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";
import CommonButton from "./CommonButton";

const BackgroundPage = () => {
  const [loading, setLoading] = useState(true);

  const handleNavigation = () => {
    window.location.href = 'http://localhost:5173';
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.navigationButtons}>
        <button 
          style={styles.navButton} 
          onClick={handleNavigation}
        >
          <span style={styles.navArrow}>&#10094;</span>
        </button>
        <button 
          style={styles.navButton} 
          onClick={handleNavigation}
        >
          <span style={styles.navArrow}>&#10095;</span>
        </button>
      </div>
      <div style={styles.contentContainer}>
        <h1>Component Test Page</h1>
        <div style={styles.componentWrapper}>
          <CommonButton text="Test Button" onClick={() => alert("Button clicked!")} />
          
          <div style={styles.spinnerWrapper}>
            <PuffLoader
              color="#0b7c3e"
              loading={loading}
              size={60}
              speedMultiplier={2}
            />
          </div>
          
          {/* 새로 추가된 예/아니오 버튼 */}
          <div style={styles.answerButtonsContainer}>
            <button 
              style={styles.answerButton} 
              onClick={handleNavigation}
            >
              예
            </button>
            <button 
              style={styles.answerButton} 
              onClick={handleNavigation}
            >
              아니오
            </button>
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>© 2025 Test Company. All rights reserved.</p>
          <div style={styles.footerLinks}>
            <span style={styles.footerLink}>Privacy Policy</span>
            <span style={styles.footerLink}>Terms of Service</span>
            <span style={styles.footerLink}>Contact Us</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  navigationButtons: {
    position: 'fixed',
    top: '50%',
    left: '20px',
    right: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    transform: 'translateY(-50%)',
    zIndex: 1000,
    maxWidth: 'calc(100% - 40px)',
  },
  navButton: {
    backgroundColor: '#0b7c3e',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    padding: 0,
    position: 'relative',
  },
  navArrow: {
    fontSize: '24px',
    fontWeight: 'bold',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    lineHeight: 1,
    userSelect: 'none',
  },
  // 새로 추가된 스타일
  answerButtonsContainer: {
    display: 'flex',
    gap: '20px',
    margin: '20px 0',
  },
  answerButton: {
    backgroundColor: '#90EE90', // 연한 녹색
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#7FCD7F', // 호버 시 약간 더 진한 녹색
    },
  },
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: "#f0f4f8",
    position: 'relative',
  },
  contentContainer: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  componentWrapper: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px",
  },
  footer: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '20px 0',
    width: '100%',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  footerText: {
    margin: 0,
    fontSize: '14px',
  },
  footerLinks: {
    display: 'flex',
    gap: '20px',
  },
  footerLink: {
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default BackgroundPage;