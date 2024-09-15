package com.example.hoversprite.Timeslot;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Entity
@Table(name = "timeslot")
@IdClass(TimeslotId.class)  // Composite key
public class Timeslot implements Serializable {

    @Id
    @Column(name = "gregorian_date", nullable = false)
    private Date gregorianDate;

    @Id
    @Column(name = "time", nullable = false)
    private String time;

    @Column(name = "available_sessions", nullable = false)
    private int availableSessions;

    // Default constructor
    public Timeslot() {}

    // Constructor for creating a timeslot
    public Timeslot(Date gregorianDate, String time, int availableSessions) {
        this.gregorianDate = gregorianDate;
        this.time = time;
        this.availableSessions = availableSessions; // Default value for new timeslots
    }

    // Method to decrease the number of available sessions
    public void decreaseAvailableSessions() {
        if (availableSessions > 0) {
            availableSessions--;
        }
    }
    
    // Utility method to check if the timeslot is full
    public boolean isFullyBooked() {
        return availableSessions <= 0;
    }
}
