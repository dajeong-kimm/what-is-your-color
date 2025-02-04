package com.ssafy.yourcolors.domain.info.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "best_color")
public class BestColor {

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
