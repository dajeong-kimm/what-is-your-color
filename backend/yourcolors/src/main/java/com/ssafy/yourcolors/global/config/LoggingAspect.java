package com.ssafy.yourcolors.global.config;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
public class LoggingAspect {  //AOP를 사용한 로깅 처리

    // controller 패키지 내의 모든 메서드를 대상으로 함
    @Pointcut("execution(* com.ssafy.yourcolors.domain.*.controller.*.*(..))")
    private void controllerPointcut() {}

    @Around("controllerPointcut()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();

        log.info("[START] {} - Arguments: {}",
                joinPoint.getSignature().toShortString(),
                joinPoint.getArgs());

        try {
            Object result = joinPoint.proceed();

            long executionTime = System.currentTimeMillis() - start;

            log.info("[END] {} - Execution Time: {}ms - Response: {}",
                    joinPoint.getSignature().toShortString(),
                    executionTime,
                    result);

            return result;
        } catch (Exception e) {
            log.error("[ERROR] {} - Exception: {}",
                    joinPoint.getSignature().toShortString(),
                    e.getMessage());
            throw e;
        }
    }
}