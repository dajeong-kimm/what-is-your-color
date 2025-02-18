import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
  } from 'react';
  
  const InactivityContext = createContext();
  
  export const InactivityProvider = ({ children }) => {
    const [isInactive, setIsInactive] = useState(false);
    const timerRef = useRef(null);
  
    const resetTimer = useCallback(() => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setIsInactive(false);
  
      // 3초 뒤에 비활동 상태로 전환
      timerRef.current = setTimeout(() => {
        setIsInactive(true);
      }, 60000);
    }, []);
  
    useEffect(() => {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('click', resetTimer);
      window.addEventListener('keydown', resetTimer);
  
      // 앱 시작 시 타이머 초기화
      resetTimer();
  
      // 언마운트 시 리스너/타이머 정리
      return () => {
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('click', resetTimer);
        window.removeEventListener('keydown', resetTimer);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, [resetTimer]);
  
    return (
      <InactivityContext.Provider value={{ isInactive, setIsInactive }}>
        {children}
      </InactivityContext.Provider>
    );
  };
  
  export const useInactivity = () => useContext(InactivityContext);
  