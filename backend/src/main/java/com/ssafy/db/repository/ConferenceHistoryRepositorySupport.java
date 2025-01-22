package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.ConferenceHistory;
import com.ssafy.db.entity.QConferenceHistory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ConferenceHistoryRepositorySupport {
    @Autowired
    private JPAQueryFactory jpaQueryFactory;
    QConferenceHistory qConferenceHistory = QConferenceHistory.conferenceHistory;

    public List<ConferenceHistory> findHistoryByUserId(Long userId) {
        return jpaQueryFactory.selectFrom(qConferenceHistory)
                .where(qConferenceHistory.user.id.eq(userId))
                .fetch();
    }
}
