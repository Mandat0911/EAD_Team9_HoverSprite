package com.example.hoversprite.Sprayer;

import com.example.hoversprite.user.User;
import com.example.hoversprite.Order.Order;
import jakarta.persistence.*;

@Entity
@Table(schema = "hoversprite", name = "sprayers")


public class Sprayer {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(name = "level")
    private String level;

    @Column(name = "available")
    private Boolean available;

    @ManyToOne
    @JoinColumn(name = "current_order_id")
    private Order currentOrder;

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

    public Order getCurrentOrder() {
        return currentOrder;
    }

    public void setCurrentOrder(Order currentOrder) {
        this.currentOrder = currentOrder;
        this.available = (currentOrder == null);
    }

    @Override
    public String toString() {
        return "Sprayer{" +
                "user=" + user +
                ", level='" + level + '\'' +
                ", available=" + available +
                ", currentOrder=" + currentOrder +
                '}';
    }
}
