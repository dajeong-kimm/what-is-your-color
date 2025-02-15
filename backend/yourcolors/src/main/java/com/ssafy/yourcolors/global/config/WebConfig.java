package com.ssafy.yourcolors.global.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final LoggingInterceptor loggingInterceptor;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // API 요청에 대해서만 CORS 적용
                .allowedOrigins(
                        "https://i12e106.p.ssafy.io",
                        "http://localhost", // 모든 포트에 대해 허용
                        "http://localhost:5176", // 로컬 개발 환경(Vite 기본 포트)
                        "http://localhost:5174", // 로컬 개발 환경(Vite 기본 포트)
                        "http://localhost:5173", // 로컬 개발 환경(Vite 기본 포트)
                        "http://3.35.236.198", // 배포된 프론트엔드 서버
                        "http://172.30.1.18:3000", //로컬 네트워크(사설 IP)
                        "http://localhost:3000"  //로컬 serve 기본 포트
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메서드
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true) // 쿠키/인증 정보 허용
                .maxAge(3600); // pre-flight 요청 캐시 시간 (1시간)
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loggingInterceptor)
                .addPathPatterns("/api/**") // API 요청에만 인터셉터 적용
                .excludePathPatterns("/css/**", "/images/**", "/js/**", "/favicon.ico");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/favicon.ico")
                .addResourceLocations("classpath:/static/");
    }
}
