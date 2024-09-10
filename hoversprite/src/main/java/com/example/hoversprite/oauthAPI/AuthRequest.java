package com.example.hoversprite.oauthAPI;

import jakarta.validation.constraints.Email;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)

public class AuthRequest {

    @Email
    @Length(min = 5, max = 50)
    private String email;

    @Length(min = 5, max = 20)
    private String phone;

    @Length(min = 5, max = 20)
    private String password;
}