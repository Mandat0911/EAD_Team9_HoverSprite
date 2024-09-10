package com.example.hoversprite.security.oauth2;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {



    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        CustomerOAuth2User oAuth2User = (CustomerOAuth2User) authentication.getPrincipal();
        String clientName = oAuth2User.getClientName();

        System.out.println("OAuth2 username: "+oAuth2User.getName());
        System.out.println("OAuth2 email: "+oAuth2User.getEmail());
        System.out.println("Client name: "+clientName);

        super.onAuthenticationSuccess(request, response, authentication);
    }
}

