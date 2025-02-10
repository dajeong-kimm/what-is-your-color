package com.ssafy.yourcolors.domain.consult.repository;

import com.ssafy.yourcolors.domain.consult.entity.ConsultPersonalColor;
import com.ssafy.yourcolors.domain.info.entity.PersonalColor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository("ConsultPersonalColorRepository")
public interface PersonalColorRepository extends JpaRepository<ConsultPersonalColor, Integer> {
    Optional<ConsultPersonalColor> findByName(String name);
}
