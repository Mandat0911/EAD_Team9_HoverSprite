package com.example.hoversprite.security.oauth2;

import com.example.hoversprite.oauthAPI.AuthenticationProvider;
import com.example.hoversprite.user.User;
import com.example.hoversprite.user.UserDetailService;

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

        // Determine which provider (Google, Facebook, etc.)
        AuthenticationProvider authProvider;

        if (clientName.equalsIgnoreCase("Google")) {
            authProvider = AuthenticationProvider.GOOGLE;
        } else if (clientName.equalsIgnoreCase("Facebook")) {
            authProvider = AuthenticationProvider.FACEBOOK;
        } else {
            authProvider = AuthenticationProvider.LOCAL;
        }

        if (user == null) {
            userDetailService.createNewUserAfterOAuthLoginSuccess(email, name, authProvider);
        }else {
            userDetailService.UpdateUserAfterOAuthLoginSuccess(user, name, authProvider);
        }



        System.out.println("OAuth2 username: "+oAuth2User.getName());
        System.out.println("OAuth2 email: "+oAuth2User.getEmail());
        System.out.println("Client name: "+clientName);

        super.onAuthenticationSuccess(request, response, authentication);
    }
}

