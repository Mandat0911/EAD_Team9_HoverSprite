package com.example.hoversprite.controllers;

import com.example.hoversprite.dto.OrderStatusUpdateDto;
import com.example.hoversprite.model.Order;
import com.example.hoversprite.service.EmailService;
import com.example.hoversprite.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private EmailService emailService;

    @PutMapping("/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable int orderId, @RequestBody OrderStatusUpdateDto statusUpdate) {
        try {
            Order order = orderService.findOrderById(orderId);
            if (order == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
            }

            order.setStatus(statusUpdate.getStatus());
            orderService.saveOrder(order);

            emailService.sendStatusUpdateEmail(order.getFarmer().getEmail(), order.getStatus());
            emailService.sendSprayerStatusEmail(order.getSprayer().getEmail(), order.getStatus());

            return ResponseEntity.ok("Order status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update order status");
        }
    }
}
