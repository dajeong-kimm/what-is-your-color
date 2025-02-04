package com.ssafy.yourcolors.domain.info.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product_personal")
public class ProductPersonal {

    @EmbeddedId  //복합 키 사용
    private ProductPersonalId id;

    @ManyToOne
    @MapsId("productId")  //복합 키의 productId를 매핑
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @MapsId("personalId")  //복합 키의 personalId를 매핑
    @JoinColumn(name = "personal_id", nullable = false)
    private PersonalColor personalColor;
}
