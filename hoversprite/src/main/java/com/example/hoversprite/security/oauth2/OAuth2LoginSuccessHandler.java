package com.example.hoversprite.security.oauth2;

import com.example.hoversprite.User.User;
import com.example.hoversprite.User.UserDetailService;
import com.example.hoversprite.oauthAPI.AuthenticationProvider;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserDetailService userDetailService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        CustomerOAuth2User oAuth2User = (CustomerOAuth2User) authentication.getPrincipal();
        String clientName = oAuth2User.getClientName();
        String name = oAuth2User.getName();
        String email = oAuth2User.getEmail();
        User user = userDetailService.getUserByEmail(email);

        if (user == null) {
            userDetailService.createNewUserAfterOAuthLoginSuccess(email, name, AuthenticationProvider.GOOGLE);
        }else {
            userDetailService.UpdateUserAfterOAuthLoginSuccess(user, name, AuthenticationProvider.GOOGLE);
        }



        System.out.println("OAuth2 username: "+oAuth2User.getName());
        System.out.println("OAuth2 email: "+oAuth2User.getEmail());
        System.out.println("Client name: "+clientName);

        super.onAuthenticationSuccess(request, response, authentication);
    }
}

