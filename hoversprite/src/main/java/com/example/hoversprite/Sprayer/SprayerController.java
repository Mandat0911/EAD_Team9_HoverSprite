package com.example.hoversprite.Sprayer;

import com.example.hoversprite.Order.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sprayers")
public class SprayerController {

    @Autowired
    SprayerService sprayerService;

    // Create
    @PostMapping
    public ResponseEntity<Sprayer> createSprayer(@RequestBody Sprayer sprayer) {
        Sprayer createdSprayer = sprayerService.createSprayer(sprayer);
        return new ResponseEntity<>(createdSprayer, HttpStatus.CREATED);
    }

    // Read (all)
    @GetMapping
    public ResponseEntity<List<Sprayer>> getAllSprayers() {
        List<Sprayer> sprayers = sprayerService.getAllSprayers();
        return new ResponseEntity<>(sprayers, HttpStatus.OK);
    }

    // Read (by id)
    @GetMapping("/{id}")
    public ResponseEntity<Sprayer> getSprayerById(@PathVariable Long id) {
        Optional<Sprayer> sprayer = sprayerService.getSprayerById(id);
        return sprayer.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Sprayer> updateSprayer(@PathVariable Long id, @RequestBody Sprayer sprayerDetails) {
        Sprayer updatedSprayer = sprayerService.updateSprayer(id, sprayerDetails);
        if (updatedSprayer != null) {
            return new ResponseEntity<>(updatedSprayer, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/{sprayerId}/orders")
    public ResponseEntity<List<Order>> getSprayerOrders(@PathVariable Long sprayerId) {
        try {
            List<Order> orders = sprayerService.getSprayerOrders(sprayerId);
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }


}
