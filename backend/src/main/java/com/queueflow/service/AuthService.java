package com.queueflow.service;

import com.queueflow.dto.AuthResponse;
import com.queueflow.dto.LoginRequest;
import com.queueflow.dto.RegisterRequest;
import com.queueflow.entity.User;
import com.queueflow.repository.UserRepository;
import com.queueflow.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @SuppressWarnings("null")
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User.Role assignedRole = User.Role.USER;
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
            assignedRole = User.Role.ADMIN;
        }

        // Generate a simple name from the email (e.g. test.user@gmail.com -> Test.user)
        String generatedName = request.getEmail().split("@")[0];
        // Capitalize first letter
        generatedName = generatedName.substring(0, 1).toUpperCase() + generatedName.substring(1);

        User user = User.builder()
                .name(generatedName)
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(assignedRole)
                .industry(request.getIndustry())
                .build();

        User nonNullUser = user;
        userRepository.save(nonNullUser);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .industry(user.getIndustry())
                .userId(user.getId())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .industry(user.getIndustry())
                .userId(user.getId())
                .build();
    }
}
