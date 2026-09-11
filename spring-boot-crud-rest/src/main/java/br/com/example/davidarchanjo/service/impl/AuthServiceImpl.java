package br.com.example.davidarchanjo.service.impl;

import br.com.example.davidarchanjo.builder.UserBuilder;
import br.com.example.davidarchanjo.exception.InvalidCredentialsException;
import br.com.example.davidarchanjo.exception.UserAlreadyExistsException;
import br.com.example.davidarchanjo.model.domain.User;
import br.com.example.davidarchanjo.model.dto.AuthResponseDTO;
import br.com.example.davidarchanjo.model.dto.LoginRequestDTO;
import br.com.example.davidarchanjo.model.dto.SignupRequestDTO;
import br.com.example.davidarchanjo.repository.UserRepository;
import br.com.example.davidarchanjo.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository repository;
    private final UserBuilder builder;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public AuthResponseDTO signup(SignupRequestDTO dto) {
        if (repository.existsByEmail(dto.getEmail())) {
            throw new UserAlreadyExistsException(
                String.format("User with email '%s' already exists", dto.getEmail()));
        }

        String encodedPassword = passwordEncoder.encode(dto.getPassword());
        User user = builder.build(dto, encodedPassword);
        User saved = repository.save(user);

        return builder.buildAuthResponse(saved);
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO dto) {
        User user = repository.findByEmail(dto.getEmail())
            .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return builder.buildAuthResponse(user);
    }
}
