package com.example.hoversprite.Sprayer;

import com.example.hoversprite.user.User;
import com.example.hoversprite.Order.Order;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(schema = "hoversprite", name = "sprayers")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "userId")
public class Sprayer {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "level")
    private String level;

    @Column(name = "available")
    private Boolean available;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "sprayers")
    private List<Order> orders = new ArrayList<>();

    // Constructors, getters, and setters

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Sprayer() {
    }

    public Sprayer(User user, String level, Boolean available) {
        this.user = user;
        this.level = level;
        this.available = available;
    }

    // Getters and setters

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public void addOrder(Order order) {
        this.orders.add(order);
        order.getSprayers().add(this);
    }
    public void removeOrder(Order order) {
        this.orders.remove(order);
        order.getSprayers().remove(this);
    }
    public boolean isAvailableForDate(Date date) {
        for (Order order : orders) {
            if (order.getGregorianDate().equals(date)) {
                return false;
            }
        }
        return true;
    }

}
