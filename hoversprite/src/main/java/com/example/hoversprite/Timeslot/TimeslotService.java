package com.example.hoversprite.Timeslot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TimeslotService {

    @Autowired
    private TimeslotRepository timeslotRepository;

    /**
     * Create a new timeslot
     */
    @Transactional
    public Timeslot createTimeslot(Timeslot timeslot) {
        return timeslotRepository.save(timeslot);
    }

    /**
     * Retrieve an timeslot by its ID
     */
    public Optional<Timeslot> getTimeslotById(Long id) {
        return timeslotRepository.findById(id);
    }
}
