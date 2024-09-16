package com.example.hoversprite.Timeslot;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Date;

public interface TimeslotRepository extends JpaRepository<Timeslot, TimeslotId> {

    // Optional<Timeslot> findByGregorianDateAndTime(Date gregorianDate, String time);

    @Query("SELECT t FROM Timeslot t WHERE t.gregorianDate = :gregorianDate AND t.time = :time")
    Optional<Timeslot> findByGregorianDateAndTime(@Param("gregorianDate") Date gregorianDate, @Param("time") String time);

}
