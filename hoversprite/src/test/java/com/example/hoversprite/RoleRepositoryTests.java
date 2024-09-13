package com.example.hoversprite;

import com.example.hoversprite.Role.Role;
import com.example.hoversprite.Role.RoleRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(false)
public class    RoleRepositoryTests {

    @Autowired
    private RoleRepository roleRepository;
    @Test
    public void testCreateUser() {
        Role user = new Role(1L,"FARMER");
        Role receptionist = new Role(2L,"RECEPTIONIST");
        Role sprayer = new Role(3L,"SPRAYER");

        roleRepository.saveAll(List.of(user, receptionist, sprayer));

        List<Role> roles = roleRepository.findAll();

        assertThat(roles.size()).isEqualTo(3);

    }
}
