package com.example.hoversprite.User;

import com.example.hoversprite.oauthAPI.AuthenticationProvider;
import com.example.hoversprite.Role.Role;
import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Entity
@Table(schema = "hoversprite")
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50)
    private String lastName;

    @Column(length = 50)
    private String middleName;

    @Column(length = 50)
    private String firstName;

    @Column(unique = true, nullable = false)
    private String phone;

    @Column(nullable = true, length = 200)
    private String address;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

//    @Enumerated(EnumType.STRING)
//    AuthenticatedRoles role;
    @Enumerated(EnumType.STRING)
    AuthenticationProvider authenticationProvider;

    @Column(columnDefinition = "TINYINT(4)")
    boolean enabled = true;

    @ManyToMany(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    Set<Role> roles = new HashSet<>();

    public User(){};

    public void addRole(Role role){
        this.roles.add(role);
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        for (Role role : roles) {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        }
        return authorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.phone; // Assuming phone is used as the username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public void setFullName(){

    }

    public String getFullName() {
        return this.lastName + " " + this.middleName + " " + this.firstName;
    }
}
