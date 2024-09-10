package com.example.hoversprite.order.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.hoversprite.repositories.OrderRepository;
import com.example.hoversprite.user.models.Order;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order findOrderById(int orderId) {
        return orderRepository.findById(orderId).orElse(null);
    }

    public void saveOrder(Order order) {
        orderRepository.save(order);
    }
}
