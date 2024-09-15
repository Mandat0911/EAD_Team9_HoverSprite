package com.example.hoversprite.Order;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

import com.example.hoversprite.user.User;

@Setter
@Getter
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


