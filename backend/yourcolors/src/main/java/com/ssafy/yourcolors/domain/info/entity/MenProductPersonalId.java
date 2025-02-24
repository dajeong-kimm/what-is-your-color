package com.ssafy.yourcolors.domain.info.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MenProductPersonalId implements Serializable {
    private int productId;
    private int personalId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        MenProductPersonalId that = (MenProductPersonalId) o;
        return productId == that.productId && personalId == that.personalId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(productId, personalId);
    }
}
