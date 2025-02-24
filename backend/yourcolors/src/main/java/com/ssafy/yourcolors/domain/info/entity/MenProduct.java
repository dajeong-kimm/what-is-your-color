package com.ssafy.yourcolors.domain.info.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "men_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenProduct {

    @Id
    @Column(name = "product_id")
    private int productId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, length = 100)
    private String brand;

    // product_detail_name를 color_name으로 사용
    @Column(name = "product_detail_name", nullable = false)
    private String productDetailName;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String image;
}
