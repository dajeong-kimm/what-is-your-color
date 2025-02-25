package com.ssafy.yourcolors.domain.info.repository;

import com.ssafy.yourcolors.domain.info.entity.MenProductPersonal;
import com.ssafy.yourcolors.domain.info.entity.MenProductPersonalId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenProductPersonalRepository extends JpaRepository<MenProductPersonal, MenProductPersonalId> {
    List<MenProductPersonal> findByIdPersonalId(int personalId);
}
