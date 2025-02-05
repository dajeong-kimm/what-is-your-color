package com.ssafy.yourcolors.domain.info.repository;

import com.ssafy.yourcolors.domain.info.entity.PersonalColor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonalColorRepository extends JpaRepository<PersonalColor, Integer> {}