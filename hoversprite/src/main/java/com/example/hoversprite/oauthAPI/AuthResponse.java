package com.example.hoversprite.oauthAPI;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)

public class AuthResponse {

    private String email;
    private String phone;
    private String accessToken;

    protected AuthResponse() {}
    public AuthResponse(String email, String phone, String accessToken) {
        this.email = email;
        this.phone = phone;
        this.accessToken = accessToken;
    }
}