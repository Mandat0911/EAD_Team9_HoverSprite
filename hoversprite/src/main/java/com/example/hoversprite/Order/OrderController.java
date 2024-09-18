package com.example.hoversprite.Order;

import com.example.hoversprite.Sprayer.Sprayer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order createdOrder = orderService.createOrder(order);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{orderId}/assign-sprayer/{sprayerId}")
    public ResponseEntity<String> assignSprayerToOrder(@PathVariable Long orderId, @PathVariable Long sprayerId) {
        boolean assigned = orderService.assignSprayerToOrder(orderId, sprayerId);
        if (assigned) {
            return ResponseEntity.ok("Sprayer successfully assigned to order");
        } else {
            return ResponseEntity.badRequest().body("Failed to assign sprayer to order");
        }
    }

    @PostMapping("/{orderId}/remove-sprayer/{sprayerId}")
    public ResponseEntity<String> removeSprayerFromOrder(@PathVariable Long orderId, @PathVariable Long sprayerId) {
        boolean removed = orderService.removeSprayerFromOrder(orderId, sprayerId);
        if (removed) {
            return ResponseEntity.ok("Sprayer successfully removed from order");
        } else {
            return ResponseEntity.badRequest().body("Failed to remove sprayer from order");
        }
    }



//    @GetMapping("/{orderId}/sprayers")
//    public ResponseEntity<List<Sprayer>> getSprayersForOrder(@PathVariable Long orderId) {
//        Optional<Order> orderOptional = orderService.getOrderById(orderId);
//        if (orderOptional.isPresent()) {
//            List<Sprayer> sprayers = orderService.getSprayersForOrder(orderOptional.get());
//            return ResponseEntity.ok(sprayers);
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
//    @GetMapping("/user/{userId}")
//    public ResponseEntity<Page<Order>> getOrders(
//            @RequestParam Long userId, // Ensure userId is being passed in
//            @RequestParam int page,
//            @RequestParam int size,
//            @RequestParam String sortBy,
//            @RequestParam String direction) {
//        System.out.println("Service layer: Fetching orders for userId: " + userId);
//        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(direction), sortBy));
//
//        // Filter orders by userId
//        Page<Order> orders = orderService.getOrdersByUserId(userId, pageable);
//
//        return ResponseEntity.ok(orders);
//    }

    @GetMapping
    public ResponseEntity<Page<Order>> getAllOrders(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String sortBy,
            @RequestParam Sort.Direction direction) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<Order> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Order>> getOrdersByUserId(
            @PathVariable Long userId,
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String sortBy,
            @RequestParam Sort.Direction direction) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<Order> orders = orderService.getOrdersByUserId(userId, pageable);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order orderDetails) {
        try {
            Order updatedOrder = orderService.updateOrder(id, orderDetails);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/cost")
    public ResponseEntity<Double> calculateOrderCost(@PathVariable Long id) {
        try {
            double cost = orderService.calculateTotalCost(id);
            return ResponseEntity.ok(cost);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

//    @GetMapping
//    public ResponseEntity<Page<Order>> getOrders(
//            @RequestParam(value = "userId", required = false) Long userId,
//            @RequestParam(value = "page", defaultValue = "0") int page,
//            @RequestParam(value = "size", defaultValue = "10") int size,
//            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
//            @RequestParam(value = "direction", defaultValue = "DESC") String direction) {
//
//        Page<Order> orders = orderService.getOrders(userId, page, size, sortBy, direction);
//        return ResponseEntity.ok(orders);
//    }
}


