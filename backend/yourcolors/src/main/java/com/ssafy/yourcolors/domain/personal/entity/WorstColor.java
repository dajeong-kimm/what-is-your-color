package com.ssafy.yourcolors.domain.personal.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "worst_color")
@Getter
public class WorstColor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "personal_id")
    private PersonalColor personalColor;

    @Column(name = "color")
    private String color;

    @Column(name = "name")
    private String name;
}