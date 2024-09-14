package com.example.hoversprite.Timeslot;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;

import com.example.hoversprite.Order.Order;

@Entity
@Table(name = "timeslot")
public class Timeslot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "gregorian_date", nullable = false)
    private Date gregorianDate;

    @Column(name = "time", nullable = false)
    private String time; // e.g., "04:00 - 05:00 AM"

    @Column(name = "available_sessions", nullable = false)
    private int availableSessions = 2; // Start with 2 sessions

    @OneToMany(mappedBy = "timeslot", cascade = CascadeType.ALL)
    private List<Order> orders = new ArrayList<>();

    public Timeslot() {
    }
    public void decreaseAvailableSessions() {
        if (this.availableSessions > 0) {
            this.availableSessions--;
        }
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Date getGregorianDate() {
        return gregorianDate;
    }
    public void setGregorianDate(Date gregorianDate) {
        this.gregorianDate = gregorianDate;
    }
    public String getTime() {
        return time;
    }
    public void setTime(String time) {
        this.time = time;
    }
    public int getAvailableSessions() {
        return availableSessions;
    }
    public void setAvailableSessions(int availableSessions) {
        this.availableSessions = availableSessions;
    }
    public List<Order> getOrders() {
        return orders;
    }
    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }
    

}

