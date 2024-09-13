package com.example.hoversprite.security.jwt;

import com.example.hoversprite.user.User;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
@Component
public class JwtTokenUtil {
    private static final Logger LOGGER = LoggerFactory.getLogger(JwtTokenUtil.class);
    private static final long EXPIRE_DURATION = 24 * 60 * 60 * 1000; // 24 hour

    @Value("${app.jwt.secret}")
    private String SECRET_KEY;



    public String generateAccessToken(User user) {
        return Jwts.builder()
                .setSubject(String.format("%s,%s,%s", user.getId(), user.getPhone(), user.getEmail()))
                .setIssuer("HoverSprite")
                .claim("roles", user.getRoles().toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE_DURATION))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }
    public boolean validateAccessToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException ex) {
            LOGGER.error("JWT expired: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            LOGGER.error("Token is null, empty, or only whitespace: {}", ex.getMessage());
        } catch (MalformedJwtException ex) {
            LOGGER.error("JWT is invalid: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            LOGGER.error("JWT is not supported: {}", ex.getMessage());
        } catch (SignatureException ex) {
            LOGGER.error("Signature validation failed: {}", ex.getMessage());
        }
        return false;
    }

    public String getSubject(String token){
        return parseClaims(token).getSubject();
    }

    public Claims parseClaims(String token){
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

}
