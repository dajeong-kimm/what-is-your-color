package com.ssafy.yourcolors.domain.info.repository;

import com.ssafy.yourcolors.domain.info.entity.MenProductPersonal;
import com.ssafy.yourcolors.domain.info.entity.MenProductPersonalId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenProductRepository extends JpaRepository<MenProductPersonal, MenProductPersonalId> {
    List<MenProductPersonal> findByIdPersonalId(int personalId);
}
