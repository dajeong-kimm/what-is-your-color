package com.ssafy.yourcolors.domain.info.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "men_product_personal")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenProductPersonal {

    @EmbeddedId
    private MenProductPersonalId id;

    // 다대일 관계: 하나의 제품은 여러 퍼스널컬러와 연결될 수 있음
    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id", nullable = false)
    private MenProduct menProduct;
    
    // personalId는 복합키의 일부로 포함되어 있으므로 별도 연관관계를 매핑하지 않고 사용합니다.
    @ManyToOne
    @MapsId("personalId")  //복합 키의 personalId를 매핑
    @JoinColumn(name = "personal_id", nullable = false)
    private PersonalColor personalColor;
}
