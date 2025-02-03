package com.ssafy.yourcolors.domain.product.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_personal")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductPersonal {

    @EmbeddedId  // 복합 키를 사용
    private ProductPersonalId id;

    @ManyToOne(fetch = FetchType.LAZY)  // Product와의 다대일 관계
    @MapsId("productId")  // 복합 키의 productId와 매핑
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private Product product;

//    @Column(name = "personal_id", insertable = false, updatable = false)
//    private int personalId;
}
