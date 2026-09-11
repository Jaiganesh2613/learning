package br.com.example.davidarchanjo.builder;

import br.com.example.davidarchanjo.model.domain.User;
import br.com.example.davidarchanjo.model.dto.AuthResponseDTO;
import br.com.example.davidarchanjo.model.dto.SignupRequestDTO;
import org.springframework.stereotype.Component;

@Component
public class UserBuilder {

    public User build(SignupRequestDTO dto, String encodedPassword) {
        return User.builder()
            .email(dto.getEmail())
            .password(encodedPassword)
            .fullName(dto.getFullName())
            .build();
    }

    public AuthResponseDTO buildAuthResponse(User user) {
        return AuthResponseDTO.builder()
            .id(user.getId())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .build();
    }
}
