package com.example.hoversprite;

import com.example.hoversprite.model.User;
import com.example.hoversprite.model.Order;
import com.example.hoversprite.repository.OrderRepository;
import com.example.hoversprite.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(false)
public class OrderRepositoryTests {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testCreateMultipleOrders() {
        // Assume these users already exist in the database (or create them)
        User farmer = userRepository.findById(1L).orElseThrow();  // ID should be Long
        User sprayer = userRepository.findById(2L).orElseThrow(); // ID should be Long

        // Create multiple orders with farmer and sprayer association
        Order order1 = new Order();
        order1.setStatus("Shipped");
        order1.setFarmer(farmer);
        order1.setSprayer(sprayer);

        Order order2 = new Order();
        order2.setStatus("Pending");
        order2.setFarmer(farmer);
        order2.setSprayer(sprayer);

        Order order3 = new Order();
        order3.setStatus("Delivered");
        order3.setFarmer(farmer);
        order3.setSprayer(sprayer);

        // Save the orders in a batch
        List<Order> orders = Arrays.asList(order1, order2, order3);
        Iterable<Order> savedOrders = orderRepository.saveAll(orders);

        // Verify that all orders are saved and have an ID
        savedOrders.forEach(order -> assertThat(order.getId()).isNotNull());
    }
}
