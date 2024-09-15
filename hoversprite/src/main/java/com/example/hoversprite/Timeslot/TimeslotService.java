package com.example.hoversprite.Timeslot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Date;

@Service
public class TimeslotService {

    @Autowired
    private TimeslotRepository timeslotRepository;

    /**
     * Create or update a timeslot based on the provided date and time.
     * If a timeslot exists, it updates the available sessions.
     * If no timeslot exists, it creates a new one with 1 booked session.
     */
    @Transactional
    public Timeslot createOrUpdateTimeslot(Date gregorianDate, String time) {
        Optional<Timeslot> existingTimeslot = timeslotRepository.findByGregorianDateAndTime(gregorianDate, time);

        if (existingTimeslot.isPresent()) {
            Timeslot timeslot = existingTimeslot.get();
            if (timeslot.getAvailableSessions() > 0) {
                timeslot.decreaseAvailableSessions();
                return timeslotRepository.save(timeslot);
            } else {
                throw new IllegalStateException("No available sessions for this time slot.");
            }
        } else {
            // Create a new timeslot if none exists
            Timeslot newTimeslot = new Timeslot(gregorianDate, time, 1); // One session booked
            return timeslotRepository.save(newTimeslot);
        }
    }

    /**
     * Retrieve a timeslot by its date and time.
     * @param gregorianDate The Gregorian date for the timeslot.
     * @param time The time string for the timeslot (e.g., "04:00 - 05:00").
     * @return Optional<Timeslot>
     */
    public Optional<Timeslot> getTimeslotByDateAndTime(Date gregorianDate, String time) {
        return timeslotRepository.findByGregorianDateAndTime(gregorianDate, time);
    }

    /**
     * Check availability of a specific timeslot.
     * @param gregorianDate The Gregorian date for the timeslot.
     * @param time The time string for the timeslot.
     * @return int The number of available sessions.
     */
    public int checkAvailability(Date gregorianDate, String time) {
        Optional<Timeslot> timeslot = timeslotRepository.findByGregorianDateAndTime(gregorianDate, time);
        // if (timeslot.isPresent()) {
        //     System.out.println("Found timeslot: " + timeslot.get());
        // } else {
        //     System.out.println("No timeslot found for Date: " + gregorianDate + ", Time: " + time);
        // }
        return timeslot.map(Timeslot::getAvailableSessions).orElse(2); // Default to 2 if no timeslot exists
    }
}
