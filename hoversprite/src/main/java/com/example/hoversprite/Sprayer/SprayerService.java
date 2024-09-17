package com.example.hoversprite.Sprayer;

import com.example.hoversprite.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SprayerService {
    @Autowired
    SprayerRepository sprayerRepository;

    @Autowired
    UserRepository userRepository;

    // Create
    public Sprayer createSprayer(Sprayer sprayer) {
        return sprayerRepository.save(sprayer);
    }

    // Read
    public List<Sprayer> getAllSprayers() {
        return sprayerRepository.findAll();
    }

    public Optional<Sprayer> getSprayerById(Long id) {
        return sprayerRepository.findById(id);
    }



    public Sprayer updateSprayer(Long id, Sprayer sprayerDetails) {
        Optional<Sprayer> optionalSprayer = sprayerRepository.findById(id);
        if (optionalSprayer.isPresent()) {
            Sprayer existingSprayer = optionalSprayer.get();



            // Update the level if provided
            if (sprayerDetails.getLevel() != null) {
                existingSprayer.setLevel(sprayerDetails.getLevel());
            }

            // Update the user if provided
            if (sprayerDetails.getUser() != null) {
                existingSprayer.setUser(sprayerDetails.getUser());
            }

            // Save and return the updated sprayer
            return sprayerRepository.save(existingSprayer);
        }
        return null;
    }



}
