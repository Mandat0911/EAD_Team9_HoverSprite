package com.example.hoversprite.order;

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
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    /**
     * Create a new order
     */
    @Transactional
    public Order createOrder(Order order) {
        // You might want to add some validation or business logic here
        return orderRepository.save(order);
    }

    /**
     * Retrieve an order by its ID
     */
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    /**
     * Retrieve all orders
     */
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }
    public Page<Order> getOrdersByUserId(Long userId, Pageable pageable) {
        return orderRepository.findOrdersByUserId(userId, pageable);
    }
    public Page<Order> getAllOrders(int page, int size, String sortBy, Sort.Direction direction) {
        Sort sort = Sort.by(direction, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return orderRepository.findAll(pageable);
    }
    /**
     * Update an existing order
     */
    @Transactional
    public Order updateOrder(Long id, Order orderDetails) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        // Update the order details
        order.setCropType(orderDetails.getCropType());
        order.setFarmlandArea(orderDetails.getFarmlandArea());
        order.setStatus(orderDetails.getStatus());
        // ... update other fields as necessary

        return orderRepository.save(order);
    }

    /**
     * Delete an order
     */
    @Transactional
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        orderRepository.delete(order);
    }

    /**
     * Find orders by status
     */
//    public List<Order> findOrdersByStatus(String status) {
//        return orderRepository.findByStatus(status);
//    }

    /**
     * Calculate total cost for an order
     */
    public double calculateTotalCost(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        // This is a placeholder for your actual cost calculation logic
        // You would replace this with your specific business logic
        return order.getFarmlandArea() * 10; // Assuming $10 per unit of farmland area
    }

}
