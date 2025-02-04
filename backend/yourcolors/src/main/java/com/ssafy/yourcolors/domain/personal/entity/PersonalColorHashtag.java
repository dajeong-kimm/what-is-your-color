package com.ssafy.yourcolors.domain.personal.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "personal_color_hashtags")
@Getter
public class PersonalColorHashtag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "personal_id")
    private PersonalColor personalColor;

    @Column(name = "hashtag")
    private String hashtag;
}