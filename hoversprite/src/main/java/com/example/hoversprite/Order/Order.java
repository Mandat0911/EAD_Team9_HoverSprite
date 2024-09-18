package com.example.hoversprite.Order;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;


import java.util.*;

import com.example.hoversprite.user.User;
import com.example.hoversprite.Sprayer.Sprayer;


@Entity
@Table(schema = "hoversprite", name = "orders")

public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderID")
    private Long orderId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIdentityReference(alwaysAsId = true)
    private User user;

    @Column(name = "CropType")
    private String cropType;

    @Column(name = "FarmlandArea")
    private Integer farmlandArea;

    @Column(name = "Time")
    private String time;

    @Column(name = "LunarDate")
    private Date lunarDate;

    @Column(name = "GregorianDate")
    private Date gregorianDate;

    @Column(name = "CreatedAt")
    private Date createdAt;

    @Column(name = "UpdatedAt")
    private Date updatedAt;

    @Column(name = "TotalCost")
    private Double totalCost;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private OrderStatus status;



    @ManyToMany
    @JoinTable(
            name = "order_sprayers",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "sprayer_id")
    )
    @JsonIdentityReference(alwaysAsId = true)
    private List<Sprayer> sprayers = new ArrayList<>();

    // Constructors

    public Order() {
    }

    public List<Sprayer> getSprayers() {
        return sprayers;
    }

    public void setSprayers(List<Sprayer> sprayers) {
        this.sprayers = sprayers;
    }

    public boolean addSprayer(Sprayer sprayer) {
        if (this.sprayers.size() < 2 && !this.sprayers.contains(sprayer)) {
            this.sprayers.add(sprayer);
            sprayer.getOrders().add(this);
            return true;
        }
        return false;
    }

    public boolean removeSprayer(Sprayer sprayer) {
        boolean removed = this.sprayers.remove(sprayer);
        if (removed) {
            sprayer.getOrders().remove(this);
        }
        return removed;
    }
    public void clearSprayers() {
        for (Sprayer sprayer : this.sprayers) {
            sprayer.getOrders().remove(this);
        }
        this.sprayers.clear();
    }


    public Order(User user, String cropType, String time, Integer farmlandArea, Date lunarDate, Date gregorianDate, Date createdAt, Date updatedAt, Double totalCost, OrderStatus status, List<Sprayer> sprayers) {
        this.user = user;
        this.cropType = cropType;
        this.time = time;
        this.farmlandArea = farmlandArea;
        this.lunarDate = lunarDate;
        this.gregorianDate = gregorianDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.totalCost = totalCost;
        this.status = status;
        this.sprayers = sprayers;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCropType() {
        return cropType;
    }

    public void setCropType(String cropType) {
        this.cropType = cropType;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Integer getFarmlandArea() {
        return farmlandArea;
    }

    public void setFarmlandArea(Integer farmlandArea) {
        this.farmlandArea = farmlandArea;
    }

    public Date getLunarDate() {
        return lunarDate;
    }

    public void setLunarDate(Date lunarDate) {
        this.lunarDate = lunarDate;
    }

    public Date getGregorianDate() {
        return gregorianDate;
    }

    public void setGregorianDate(Date gregorianDate) {
        this.gregorianDate = gregorianDate;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Double getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(Double totalCost) {
        this.totalCost = totalCost;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }


    public enum OrderStatus {
        PENDING, CANCELLED, CONFIRMED, ASSIGNED, IN_PROGRESS, COMPLETED
    }
}
