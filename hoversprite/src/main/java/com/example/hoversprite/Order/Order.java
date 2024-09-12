package com.example.hoversprite.order;

import com.example.hoversprite.model.User;
import jakarta.persistence.*;

import java.util.Date;

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

    // Constructors, getters, and setters

    public Order() {
    }

    public Order(User user, String cropType, Integer farmlandArea, String time, Date lunarDate, Date gregorianDate, Date createdAt, Date updatedAt, Double totalCost, OrderStatus status) {
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

    public Integer getFarmlandArea() {
        return farmlandArea;
    }

    public void setFarmlandArea(Integer farmlandArea) {
        this.farmlandArea = farmlandArea;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
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

    @Override
    public String toString() {
        return "Order{" +
                "orderId=" + orderId +
                ", cropType='" + cropType + '\'' +
                ", farmlandArea=" + farmlandArea +
                ", time='" + time + '\'' +
                ", lunarDate=" + lunarDate +
                ", gregorianDate=" + gregorianDate +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", totalCost=" + totalCost +
                ", status=" + status +
                '}';
    }

    public enum OrderStatus {
        PENDING, CANCELLED, CONFIRMED, ASSIGNED, IN_PROGRESS, COMPLETED
    }
}


