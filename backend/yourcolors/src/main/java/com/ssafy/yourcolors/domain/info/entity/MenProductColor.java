package com.ssafy.yourcolors.domain.info.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "men_product_color")
@IdClass(MenProductColorId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenProductColor {

    @Id
    @Column(name = "product_id")
    private int productId;

    @Id
    @Column(name = "color", nullable = false, length = 7)
    private String color;
}
