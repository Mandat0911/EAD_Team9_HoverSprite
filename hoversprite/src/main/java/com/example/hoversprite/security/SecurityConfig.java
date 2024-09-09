package com.example.hoversprite.security;

import com.example.hoversprite.security.jwt.JwtTokenFilter;
import com.example.hoversprite.security.oauth2.OAuth2LoginSuccessHandler;
import com.example.hoversprite.service.CustomerDetailService;
import com.example.hoversprite.service.CustomerOAuth2UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;

import javax.sql.DataSource;

@Configuration
public class SecurityConfig {
    @Autowired
    private CustomerDetailService customerDetailService;
    @Autowired
    private CustomerOAuth2UserService customerOAuth2UserService;
    @Autowired
    private DataSource dataSource;
    @Autowired
    private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    @Autowired
    private JwtTokenFilter jwtTokenFilter;


    @Bean
    UserDetailsService userDetailsService() {
        return new CustomerDetailService();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception{
        return configuration.getAuthenticationManager();
    }

    @Bean
    BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }
    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        System.out.println("return login");
        return (request, response, authException) -> {
            response.sendRedirect("/login");  // Redirect to login page
        };
    }
    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        System.out.println("return a");

        return (request, response, accessDeniedException) -> {
            response.sendRedirect("/error");  // Redirect to error page for unauthorized access
        };
    }
    @Bean
    public PersistentTokenRepository persistentTokenRepository() {
        JdbcTokenRepositoryImpl tokenRepo = new JdbcTokenRepositoryImpl();
        tokenRepo.setDataSource(dataSource);
        return tokenRepo;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.authenticationProvider(authenticationProvider());

        http
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF for stateless APIs
//                .sessionManagement(sessionManagement ->
//                        sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//
//                )

                .authorizeHttpRequests(auth ->
                        auth
                                .requestMatchers("/auth/login","/login").permitAll()
                                //.requestMatchers("/list_users","/list_orders").authenticated()
                                //.requestMatchers("/users/edit/**").hasAnyAuthority("RECEPTIONIST")
                                .anyRequest().permitAll()
                )
                .exceptionHandling(customizer ->
                        customizer
                                .authenticationEntryPoint(authenticationEntryPoint())  // Handle unauthenticated requests
                                .accessDeniedHandler(accessDeniedHandler())            // Handle unauthorized access
                ).addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                        })
                )
                .formLogin(login -> login
                        .loginPage("/login")
                        .usernameParameter("username")
                        .defaultSuccessUrl("/list_users")
                        .permitAll()
//                ) .rememberMe(rememberMe -> rememberMe
//                        .tokenRepository(persistentTokenRepository())
//                        .tokenValiditySeconds(3 * 24 * 60 * 60)
//                        .key("uniqueAndSecretKey")
//                        .rememberMeParameter("remember-me")
//                        .userDetailsService(customerDetailService) // Here is the usage
//                ).oauth2Login(oauth2 -> oauth2
//                        .loginPage("/login")
//                        .defaultSuccessUrl("/list_users")
//                        .userInfoEndpoint(userInfo -> userInfo.userService(customerOAuth2UserService))
//                        .successHandler(oAuth2LoginSuccessHandler)
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("/login")
                        .permitAll()
                );



        return http.build();
    }
}
