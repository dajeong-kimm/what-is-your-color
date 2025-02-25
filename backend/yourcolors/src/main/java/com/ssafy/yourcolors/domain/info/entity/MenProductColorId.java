package com.ssafy.yourcolors.domain.info.entity;

import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MenProductColorId implements Serializable {
    private int productId;
    private String color;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MenProductColorId)) return false;
        MenProductColorId that = (MenProductColorId) o;
        return productId == that.productId && Objects.equals(color, that.color);
    }

    @Override
    public int hashCode() {
        return Objects.hash(productId, color);
    }
}
