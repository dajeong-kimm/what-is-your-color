package com.ssafy.yourcolors.domain.info.repository;

import com.ssafy.yourcolors.domain.info.entity.MenProductColor;
import com.ssafy.yourcolors.domain.info.entity.MenProductColorId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenProductColorRepository extends JpaRepository<MenProductColor, MenProductColorId> {
    List<MenProductColor> findByProductId(int productId);
}
