package com.ssafy.yourcolors.domain.info.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "worst_color")
public class WorstColor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "personal_id", nullable = false)
    private PersonalColor personalColor;

    @Column(name = "color", nullable = false)
    private String color;

    @Column(name = "name")
    private String name;
}
