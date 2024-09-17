package com.example.hoversprite.Sprayer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SprayerRepository extends JpaRepository<Sprayer, Long> {

}
