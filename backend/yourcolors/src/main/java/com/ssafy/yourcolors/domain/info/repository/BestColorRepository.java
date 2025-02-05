package com.ssafy.yourcolors.domain.info.repository;

import com.ssafy.yourcolors.domain.info.entity.BestColor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BestColorRepository extends JpaRepository<BestColor, Integer> {}