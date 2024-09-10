package com.example.hoversprite.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Table(schema = "hoversprite")
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, length = 45)
    String name;

    public Role(){};

    public Role(Long id) {
        this.id = id;
    }

    public Role(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return this.name;
    }
}

