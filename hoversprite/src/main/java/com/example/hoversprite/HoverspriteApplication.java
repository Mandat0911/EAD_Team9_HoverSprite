package com.example.hoversprite;

import com.example.hoversprite.Role.Role;
import com.example.hoversprite.Role.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class HoverspriteApplication {

	public static void main(String[] args) {
		SpringApplication.run(HoverspriteApplication.class, args);
	}
	@Bean
	CommandLineRunner run(RoleRepository roleRepository) {
		return args -> {
			// Create roles if they do not already exist in the database
			if (roleRepository.count() == 0) {
				Role farmer = new Role(1L, "FARMER");
				Role receptionist = new Role(2L, "RECEPTIONIST");
				Role sprayer = new Role(3L, "SPRAYER");

				roleRepository.saveAll(List.of(farmer, receptionist, sprayer));
				System.out.println("Roles have been saved.");
			} else {
				System.out.println("Roles already exist in the database.");
			}

			// Fetch all roles from the database and print them
			List<Role> roles = roleRepository.findAll();
			roles.forEach(role -> System.out.println("Role: " + role.getName()));
		};
	}

}
