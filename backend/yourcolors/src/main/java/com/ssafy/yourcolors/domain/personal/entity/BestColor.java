package com.ssafy.yourcolors.domain.personal.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "best_color")
@Getter
public class BestColor {
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