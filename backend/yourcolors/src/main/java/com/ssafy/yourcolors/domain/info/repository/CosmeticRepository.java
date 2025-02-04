package com.ssafy.yourcolors.domain.info.repository;

import com.ssafy.yourcolors.domain.info.entity.ProductPersonal;
import com.ssafy.yourcolors.domain.info.entity.ProductPersonalId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CosmeticRepository extends JpaRepository<ProductPersonal, ProductPersonalId> {

    List<ProductPersonal> findByIdPersonalId(int personalId);
}
