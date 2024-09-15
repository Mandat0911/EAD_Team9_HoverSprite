package com.example.hoversprite.security.jwt;

import com.example.hoversprite.Role.Role;
import com.example.hoversprite.user.User;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (!hasAuthorizationBearer(request)){
            filterChain.doFilter(request, response);
            return;
        }

        String accessToken = getAccessToken(request);

        if (!jwtTokenUtil.validateAccessToken(accessToken)){
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        setAuthenticationContext(accessToken, request);
        filterChain.doFilter(request, response);
    }

    private boolean hasAuthorizationBearer(HttpServletRequest request){
        String header = request.getHeader("Authorization");
        if (ObjectUtils.isEmpty(header) || !header.startsWith("Bearer")){
            return false;
        }
        return true;
    }

    private String getAccessToken(HttpServletRequest request){
        String header = request.getHeader("Authorization");
        String token = header.split(" ")[1].trim();
        System.out.println("Access Token: " + token);
        return token;
    }

    private void setAuthenticationContext(String accessToken, HttpServletRequest request) {
        UserDetails userDetails = getUserDetails(accessToken);
        System.out.println("User roles: " + userDetails.getAuthorities());
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
        System.out.println(usernamePasswordAuthenticationToken.getAuthorities());
    }

    private UserDetails getUserDetails(String accessToken) {
        User userDetail = new User();
        Claims claims = jwtTokenUtil.parseClaims(accessToken);
        String subject = (String) claims.get(Claims.SUBJECT);

        String claimsRoles = (String) claims.get("roles");

        System.out.println(claimsRoles);

        claimsRoles = claimsRoles.replace("[", "").replace("]","");

        String[] roleNames = claimsRoles.split(",");
        for (String aRoleName : roleNames){
            userDetail.addRole(new Role(aRoleName));
        }

        String[] jwtSubject = subject.split(",");
        userDetail.setId(Long.parseLong(jwtSubject[0]));
        userDetail.setPhone(jwtSubject[1]);
        userDetail.setEmail(jwtSubject[2]);

        return userDetail;
    }
}
