package com.example.hoversprite;

import com.example.hoversprite.model.User;
import com.example.hoversprite.repository.RoleRepository;
import com.example.hoversprite.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;
import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(false)
public class UserRepositoryTests {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    @Test
    public void testCreateUser() {
            User user = new User();
            user.setLastName("Doe");
            user.setMiddleName("M");
            user.setFirstName("John");
            user.setPhone("0901234567");
            user.setAddress("123 Main St");
            user.setPassword("password");
            user.setEmail("john.doe@example.com");


        User savedUser =  userRepository.save(user);



        assertThat(savedUser.getId()).isNotNull();
        }
}
