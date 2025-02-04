package com.ssafy.yourcolors.domain.info.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "personal_color")
public class PersonalColor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "personal_id")
    private int personalId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "english_name", nullable = false)
    private String englishName;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "personalColor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BestColor> bestColors;

    @OneToMany(mappedBy = "personalColor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorstColor> worstColors;

    @OneToMany(mappedBy = "personalColor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Hashtag> hashtags;

    @OneToMany(mappedBy = "personalColor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FashionColor> fashionColors;

    @OneToMany(mappedBy = "personalColor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LipColor> lipColors;

    @OneToMany(mappedBy = "personalColor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChicColor> chicColors;

    @OneToMany(mappedBy = "personalColor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EyeColor> eyeColors;
}
