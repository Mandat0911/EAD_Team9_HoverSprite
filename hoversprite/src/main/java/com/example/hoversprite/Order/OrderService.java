package com.example.hoversprite.Order;

import com.example.hoversprite.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.hoversprite.Timeslot.TimeslotService;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TimeslotService timeslotService;

    /**
     * Create a new order
     */
    @Transactional
    public Order createOrder(Order order) {
        // Check availability of the selected timeslot before creating the order
        int availableSessions = timeslotService.checkAvailability(order.getGregorianDate(), order.getTime());

        if (availableSessions <= 0) {
            throw new IllegalStateException("No available sessions for the selected time slot.");
        }
        
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

//
//    public Page<Order> getOrdersByUserId(Long userId, Pageable pageable) {
//        System.out.println("Service layer: Fetching orders for userId: " + userId);
//        return orderRepository.findOrdersByUserId(userId, pageable);
//    }


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


//    public Page<Order> getOrders(Long userId, int page, int size, String sortBy, String direction) {
//        // Get the current authentication object
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
//        // Check if the user has the RECEPTIONIST role
//        boolean isReceptionist = authentication.getAuthorities().stream()
//                .anyMatch(authority -> authority.getAuthority().equals("RECEPTIONIST"));
//
//        // Define Pageable with sorting options
//        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(direction), sortBy));
//
//        // Fetch orders based on role
//        if (isReceptionist) {
//            // If the user is a RECEPTIONIST, return all orders
//            return orderRepository.findAll(pageable);
//        } else {
//            // If the user is not a RECEPTIONIST, filter by userId
//            // Ensure userId is not null and properly handle it
//            if (userId == null) {
//                throw new IllegalArgumentException("User ID must be provided for non-receptionists");
//            }
//            return orderRepository.findByUserId(userId, pageable);
//        }
//    }

}
