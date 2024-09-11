package com.example.hoversprite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hoversprite.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
}
