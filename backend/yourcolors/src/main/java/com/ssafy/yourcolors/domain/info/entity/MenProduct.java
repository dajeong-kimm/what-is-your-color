package com.ssafy.yourcolors.domain.info.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

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

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "brand", nullable = false)
    private String brand;

    @Column(name = "product_detail_name", nullable = false)
    private String productDetailName;

    @Column(name = "price", nullable = false)
    private int price;

    @Column(name = "image")
    private String image;
}
