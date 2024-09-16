package com.example.hoversprite.Order;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
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

    @ElementCollection
    @CollectionTable(name = "order_sprayer_ids", joinColumns = @JoinColumn(name = "order_id"))
    @Column(name = "sprayer_id")
    private List<Long> sprayerIds = new ArrayList<>(2);


    // Constructors

    public Order() {
    }




    public void addSprayerId(Long sprayerId) {
        if (this.sprayerIds.size() < 2) {
            this.sprayerIds.add(sprayerId);
        }
    }

    public void removeSprayerId(Long sprayerId) {
        this.sprayerIds.remove(sprayerId);
    }


    public Order(User user, String cropType, Integer farmlandArea, String time, Date lunarDate, Date gregorianDate, Date createdAt, Date updatedAt, Double totalCost, OrderStatus status, List<Long> sprayerIds) {
        this.user = user;
        this.cropType = cropType;
        this.farmlandArea = farmlandArea;
        this.time = time;
        this.lunarDate = lunarDate;
        this.gregorianDate = gregorianDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.totalCost = totalCost;
        this.status = status;
        this.sprayerIds = sprayerIds;
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

    public List<Long> getSprayerIds() {
        return sprayerIds;
    }

    public void setSprayerIds(List<Long> sprayerIds) {
        this.sprayerIds = sprayerIds;
    }
    // Helper methods for managing sprayer IDs
    public boolean addSprayer(Sprayer sprayer) {
        if (this.sprayerIds.size() < 2 && !this.sprayerIds.contains(sprayer.getUser().getId())) {
            this.sprayerIds.add(sprayer.getUser().getId());
            sprayer.setCurrentOrder(this);
            return true;
        }
        return false;
    }

    public boolean removeSprayer(Sprayer sprayer) {
        boolean removed = this.sprayerIds.remove(sprayer.getUser().getId());
        if (removed) {
            sprayer.setCurrentOrder(null);
        }
        return removed;
    }

    public void clearSprayers() {
        this.sprayerIds.clear();
    }

    @Override
    public String toString() {
        return "Order{" +
                "orderId=" + orderId +
                ", user=" + user +
                ", cropType='" + cropType + '\'' +
                ", farmlandArea=" + farmlandArea +
                ", time='" + time + '\'' +
                ", lunarDate=" + lunarDate +
                ", gregorianDate=" + gregorianDate +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", totalCost=" + totalCost +
                ", status=" + status +
                ", sprayerIds=" + sprayerIds +
                '}';
    }

    public enum OrderStatus {
        PENDING, CANCELLED, CONFIRMED, ASSIGNED, IN_PROGRESS, COMPLETED
    }
}
