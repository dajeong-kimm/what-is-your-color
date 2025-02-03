package com.ssafy.yourcolors.domain.product.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable  // 복합 키로 사용되는 클래스
public class ProductPersonalId implements Serializable {
    private int productId;
    private int personalId;
}
