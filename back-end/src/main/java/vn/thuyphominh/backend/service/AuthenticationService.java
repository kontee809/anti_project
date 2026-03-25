package vn.thuyphominh.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.thuyphominh.backend.dto.AuthenticationRequest;
import vn.thuyphominh.backend.dto.AuthenticationResponse;
import vn.thuyphominh.backend.dto.RegisterRequest;
import vn.thuyphominh.backend.entity.Role;
import vn.thuyphominh.backend.entity.Status;
import vn.thuyphominh.backend.entity.User;
import vn.thuyphominh.backend.repository.UserRepository;
import vn.thuyphominh.backend.security.JwtService;

import java.util.Map;
import java.util.HashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationService.class);

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public Map<String, String> register(RegisterRequest request) {
        log.info("Attempting to register new user with email: {}", request.getEmail());
        var existingUser = repository.findByEmail(request.getEmail());
        log.info("Result of findByEmail({}): isPresent={}", request.getEmail(), existingUser.isPresent());
        
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .status(Status.ACTIVE)
                .build();
        
        repository.save(user);
        
        log.info("New ADMIN user created: {}", user.getEmail());
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        return response;
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        log.info("Attempting to authenticate user with email: {}", request.getEmail());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        log.info("Authentication successful for email: {}", request.getEmail());
                
        var jwtToken = jwtService.generateToken(user);
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .build();
    }
}
