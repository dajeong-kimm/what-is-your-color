package com.ssafy.yourcolors.domain.info.repository;

import com.ssafy.yourcolors.domain.info.entity.WorstColor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorstColorRepository extends JpaRepository<WorstColor, Integer> {}