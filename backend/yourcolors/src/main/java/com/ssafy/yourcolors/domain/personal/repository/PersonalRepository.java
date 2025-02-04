package com.ssafy.yourcolors.domain.personal.repository;

import com.ssafy.yourcolors.domain.personal.entity.PersonalColor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonalRepository extends JpaRepository<PersonalColor, Long> {
}