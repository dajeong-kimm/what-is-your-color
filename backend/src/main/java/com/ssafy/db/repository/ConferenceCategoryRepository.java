package com.ssafy.db.repository;

import com.ssafy.db.entity.ConferenceCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConferenceCategoryRepository extends JpaRepository<ConferenceCategory, Long> {
}
