package com.ssafy.yourcolors.domain.product.repository;

import com.ssafy.yourcolors.domain.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer>{
//    List<Product> findByPersonalId(int personalId);  // 퍼스널 컬러 ID로 제품 조회

    // 퍼스널 컬러 ID로 제품 목록 조회 (JOIN 쿼리)
    @Query("SELECT p FROM Product p JOIN ProductPersonal pp ON p.id = pp.id.productId WHERE pp.id.personalId = :personalId")
    List<Product> findProductsByPersonalColor(@Param("personalId") int personalId);
}
