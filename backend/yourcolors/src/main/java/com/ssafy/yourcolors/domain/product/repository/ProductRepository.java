package com.ssafy.yourcolors.domain.product.repository;

import com.ssafy.yourcolors.domain.product.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Products, Integer>{
    List<Products> findByPersonalId(Long personalId);  // 퍼스널 컬러 ID로 제품 조회
}
