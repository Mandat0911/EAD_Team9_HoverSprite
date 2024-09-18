package com.example.hoversprite.Order;

import com.example.hoversprite.user.User;
import com.example.hoversprite.user.UserDetailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import com.example.hoversprite.Sprayer.Sprayer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import java.io.UnsupportedEncodingException;
import java.util.Collections;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private UserDetailService userDetailService;

    @Autowired
    private JavaMailSender javaMailSender;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        try {
            // Create the order in the database
            Order createdOrder = orderService.createOrder(order);

            // Fetch the user details for sending the email notification
            User user = userDetailService.findById(order.getUser().getId());

            // Send the order confirmation email to the user
            sendOrderConfirmationEmail(user, createdOrder);

            // Return the created order as a response with status 201 (Created)
            return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
        } catch (Exception e) {
            // Handle any exception and return an error response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "Failed to create order or send email."));
        }
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



    @GetMapping("/{orderId}/sprayers")
    public ResponseEntity<List<Sprayer>> getSprayersForOrder(@PathVariable Long orderId) {
        Optional<Order> orderOptional = orderService.getOrderById(orderId);
        if (orderOptional.isPresent()) {
            List<Sprayer> sprayers = orderService.getSprayersForOrder(orderOptional.get());
            return ResponseEntity.ok(sprayers);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
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


    private void sendOrderConfirmationEmail(User user, Order order) throws MessagingException, UnsupportedEncodingException {
        String subject = "Order Confirmation";
        String senderName = "HoverSprite";
        String mailContent = "<html>"
                + "<head>"
                + "<style>"
                + "body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }"
                + ".email-container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; border: 1px solid #ddd; border-radius: 10px; }"
                + ".email-header { background-color: #4CAF50; padding: 10px; color: white; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px; }"
                + ".email-body { padding: 20px; background-color: white; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; }"
                + ".email-footer { margin-top: 20px; font-size: 0.9em; color: #777; text-align: center; }"
                + ".email-body h2 { color: #4CAF50; font-size: 24px; margin-bottom: 10px; }"
                + ".email-body p { margin: 5px 0; }"
                + ".order-details { margin: 20px 0; }"
                + ".order-details p { margin: 5px 0; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='email-container'>"
                + "  <div class='email-header'>"
                + "    <h1>Order Confirmation</h1>"
                + "  </div>"
                + "  <div class='email-body'>"
                + "    <h2>Hello, " + user.getFullName() + "</h2>"
                + "    <p>Thank you for placing an order with HoverSprite. Here are the details of your order:</p>"
                + "    <div class='order-details'>"
                + "      <p><strong>Crop Type:</strong> " + order.getCropType() + "</p>"
                + "      <p><strong>Farmland Area:</strong> " + order.getFarmlandArea() + " decare</p>"
                + "      <p><strong>Time Slot:</strong> " + order.getTime() + "</p>"
                + "      <p><strong>Total Cost:</strong>" + order.getTotalCost() + "VND</p>"
                + "      <p><strong>Order Status:</strong> " + order.getStatus() + "</p>"
                + "    </div>"
                + "    <p>If you have any questions, feel free to contact us at support@hoversprite.com.</p>"
                + "    <p>Thank you for choosing HoverSprite!</p>"
                + "  </div>"
                + "  <div class='email-footer'>"
                + "    <p>&copy; 2024 HoverSprite. All rights reserved.</p>"
                + "  </div>"
                + "</div>"
                + "</body>"
                + "</html>";


        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom("nguyenmandat000@gmail.com", senderName);
        helper.setTo(user.getEmail());

        System.out.println(user.getEmail());
        helper.setSubject(subject);
        helper.setText(mailContent, true);

        javaMailSender.send(message);
    }
}


