package com.ssafy.yourcolors.domain.info.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
