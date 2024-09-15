package com.example.hoversprite.Timeslot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timeslot")
public class TimeslotController {

    @Autowired
    private TimeslotService timeslotService;

    @PostMapping
    public ResponseEntity<Timeslot> createTimeslot(@RequestBody Timeslot timeslot) {
        Timeslot createdTimeslot = timeslotService.createTimeslot(timeslot);
        return new ResponseEntity<>(createdTimeslot, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Timeslot> getTimeslotById(@PathVariable Long id) {
        return timeslotService.getTimeslotById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

