package com.ssafy.yourcolors.domain.info.entity;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ProductColorId implements Serializable {
    private int product;
    private String color;
}
