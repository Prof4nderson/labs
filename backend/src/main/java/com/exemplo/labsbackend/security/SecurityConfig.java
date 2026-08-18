package com.exemplo.labsbackend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    /**
     * Origens permitidas no CORS. O nome da variavel e o mesmo publicado pelo docker-compose
     * (FRONTEND_ORIGINS); CORS_ALLOWED_ORIGINS continua aceito como alternativa.
     */
    @Value("${FRONTEND_ORIGINS:${CORS_ALLOWED_ORIGINS:http://localhost,http://localhost:3000,http://localhost:5173}}")
    private String frontendOrigins;

    /** Expoe /swagger-ui e /v3/api-docs apenas quando explicitamente habilitado (desligado por padrao). */
    @Value("${labs.docs.public:false}")
    private boolean publicDocs;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // API REST stateless com JWT: CSRF por cookie de sessao nao se aplica.
                .csrf(AbstractHttpConfigurer::disable)
                .cors(c -> c.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(e -> e.authenticationEntryPoint(
                        new HttpStatusEntryPoint(org.springframework.http.HttpStatus.UNAUTHORIZED)))
                .authorizeHttpRequests(auth -> {
                    // Preflight nunca carrega credenciais e precisa passar antes da autenticacao.
                    auth.requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher
                            .antMatcher(HttpMethod.OPTIONS, "/**")).permitAll();
                    auth.requestMatchers("/api/auth/**", "/labs/**").permitAll();
                    if (publicDocs) {
                        auth.requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll();
                    }
                    // IA e ingestao vetorial custam dinheiro e gravam dados: exigem JWT valido.
                    auth.requestMatchers("/api/vector/**", "/api/ai/**").authenticated();
                    auth.anyRequest().authenticated();
                })
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        List<String> origins = Arrays.stream(frontendOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toList();

        CorsConfiguration c = new CorsConfiguration();
        // Lista explicita de origens (nunca "*"), compativel com allowCredentials.
        c.setAllowedOriginPatterns(origins);
        c.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        c.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));
        c.setExposedHeaders(List.of("Authorization"));
        c.setAllowCredentials(true);
        c.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", c);
        return src;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
