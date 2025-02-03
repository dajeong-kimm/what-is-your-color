package com.ssafy.yourcolors.domain.product.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity  // 이 클래스가 JPA 엔티티임을 나타냄
@Table(name = "products")  // 데이터베이스의 테이블 이름과 매핑
@Data  // Lombok: Getter, Setter, toString, equals, hashCode 자동 생성
@Builder  // Lombok: 빌더 패턴 적용
@NoArgsConstructor  // Lombok: 기본 생성자 생성
@AllArgsConstructor  // Lombok: 모든 필드를 포함하는 생성자 생성
public class Product {

    @Id  // Primary Key 설정
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto Increment 설정
    private int productId;  // 제품 ID (Primary Key)

    @Column(name = "product_name", nullable = false)  // DB 컬럼 매핑
    private String productName;  // 제품 이름

    @Column(nullable = false)
    private String category;    // 카테고리

    @Column(nullable = false)
    private String brand;        // 브랜드 이름

    @Column(nullable = false)
    private int price;           // 가격

    @Column(name = "product_detail_name")
    private String colorName;      // 제품 상세 설명

//    private String image;  // 이미지 필드 추가

}
