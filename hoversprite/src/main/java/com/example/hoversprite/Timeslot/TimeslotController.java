package com.example.hoversprite.Timeslot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Optional;
import java.text.ParseException;
import java.text.SimpleDateFormat;


@RestController
@RequestMapping("/api/timeslot")
public class TimeslotController {

    @Autowired
    private TimeslotService timeslotService;

    /**
     * Create or update a timeslot based on the date and time.
     * This will be called after an order is created.
     * 
     * @param gregorianDate The selected Gregorian date of the order.
     * @param time The selected time slot of the order.
     * @return ResponseEntity with the created or updated timeslot.
     */
    @PostMapping
    public ResponseEntity<Timeslot> createTimeslot(@RequestBody Timeslot timeslot) {
        Timeslot createdTimeslot = timeslotService.createOrUpdateTimeslot(timeslot.getGregorianDate(), timeslot.getTime());
        return new ResponseEntity<>(createdTimeslot, HttpStatus.CREATED);
    }


    /**
     * Check availability for a given timeslot (date and time).
     * 
     * @param gregorianDate The Gregorian date of the timeslot.
     * @param time The time slot (e.g., "04:00 - 05:00").
     * @return ResponseEntity with the available session count.
     * @throws ParseException 
     */
    // @GetMapping("/availability")
    // public ResponseEntity<Integer> checkAvailability(
    //         @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date gregorianDate,
    //         @RequestParam("time") String time) {
    //     System.out.println("** Timeslot controller **");
    //     // Debugging - log the received request parameters
    //     System.out.println("Received request for date: " + gregorianDate + ", time: " + time);

    //     int availableSessions = timeslotService.checkAvailability(gregorianDate, time);

    //     // Debugging - log the response being returned
    //     System.out.println("Returning available sessions: " + availableSessions + " for date: " + gregorianDate + ", time: " + time);

    //     return new ResponseEntity<>(availableSessions, HttpStatus.CREATED);  // Return the available session count
    // }
    @GetMapping("/availability")
    public ResponseEntity<Integer> checkAvailability(
        @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date gregorianDate,
        @RequestParam("time") String time) throws ParseException {

        try {
            // Ensure that only the date part is being considered, ignoring the time portion
            SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
            String formattedDateStr = dateFormatter.format(gregorianDate);
    
            // Convert back to Date after formatting
            Date formattedGregorianDate = dateFormatter.parse(formattedDateStr);

            // System.out.println("Received request for date: " + formattedGregorianDate + ", time: " + time);

            int availableSessions = timeslotService.checkAvailability(formattedGregorianDate, time);

            // System.out.println("Returning available sessions: " + availableSessions + " for date: " + gregorianDate + ", time: " + time);

            return new ResponseEntity<>(availableSessions, HttpStatus.CREATED);
    
        } catch (ParseException e) {
            // Handle exception if date parsing fails
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    
    // @PostMapping("/availability")
    // public ResponseEntity<Integer> checkAvailability(@RequestBody Timeslot timeslot) {
    //     int availableSessions = timeslotService.checkAvailability(timeslot.getGregorianDate(), timeslot.getTime());
    //     return ResponseEntity.ok(availableSessions);  // Return the available session count
    // }

}
