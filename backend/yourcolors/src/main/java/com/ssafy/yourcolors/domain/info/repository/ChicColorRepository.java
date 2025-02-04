package com.ssafy.yourcolors.domain.info.repository;

import com.ssafy.yourcolors.domain.info.entity.ChicColor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChicColorRepository extends JpaRepository<ChicColor, Integer> {}