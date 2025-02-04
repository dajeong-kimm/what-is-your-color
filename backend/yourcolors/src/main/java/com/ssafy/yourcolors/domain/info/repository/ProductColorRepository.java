package com.ssafy.yourcolors.domain.info.repository;

import com.ssafy.yourcolors.domain.info.entity.ProductColor;
import com.ssafy.yourcolors.domain.info.entity.ProductColorId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductColorRepository extends JpaRepository<ProductColor, ProductColorId> {
    List<ProductColor> findByProduct_ProductId(Long productId);
}
