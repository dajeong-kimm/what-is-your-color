package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Conference extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "conference_category")
    private ConferenceCategory category;

    private LocalDateTime callStartTime;
    private LocalDateTime callEndTime;
    private String thumbnailUrl;
    private String title;
    private String description;
    private Boolean isActive = true;
}
