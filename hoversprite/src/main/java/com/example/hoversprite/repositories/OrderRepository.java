package com.example.hoversprite.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hoversprite.user.models.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
}
