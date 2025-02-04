package com.ssafy.yourcolors.domain.info.entity;

import com.ssafy.yourcolors.domain.products.entity.Product;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "product_color")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(ProductColorId.class) // 복합 키 설정
public class ProductColor {

    @Id
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false, updatable = false)
    private Product product;

    @Id
    @Column(name = "color", length = 7, nullable = false)
    private String color;
}
