package com.ssafy.yourcolors.domain.personal.Entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.List;

@Entity
@Table(name = "personal_color")
@Getter
public class PersonalColor {
    @Id
    @Column(name = "personal_id")
    private Integer personalId;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;


    @OneToMany(mappedBy = "personalColor", cascade = CascadeType.ALL)
    private List<PersonalColorHashtag> hashtags;

    @OneToMany(mappedBy = "personalColor", cascade = CascadeType.ALL)
    private List<BestColor> bestColors;

    @OneToMany(mappedBy = "personalColor", cascade = CascadeType.ALL)
    private List<WorstColor> worstColors;
}