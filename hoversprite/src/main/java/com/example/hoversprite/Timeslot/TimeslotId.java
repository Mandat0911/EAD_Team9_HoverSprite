package com.example.hoversprite.Timeslot;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

public class TimeslotId implements Serializable {

    private Date gregorianDate;
    private String time;

    public TimeslotId() {
    }

    public TimeslotId(Date gregorianDate, String time) {
        this.gregorianDate = gregorianDate;
        this.time = time;
    }

    // Getters and Setters

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TimeslotId that = (TimeslotId) o;
        return Objects.equals(gregorianDate, that.gregorianDate) && 
               Objects.equals(time, that.time);
    }

    @Override
    public int hashCode() {
        return Objects.hash(gregorianDate, time);
    }
}
