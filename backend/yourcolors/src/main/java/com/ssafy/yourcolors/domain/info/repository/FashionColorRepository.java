package com.ssafy.yourcolors.domain.info.repository;

import com.ssafy.yourcolors.domain.info.entity.FashionColor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FashionColorRepository extends JpaRepository<FashionColor, Integer> {}