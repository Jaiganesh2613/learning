package br.com.example.davidarchanjo.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthResponseDTO {

    private Long id;
    private String email;

    @JsonProperty("fullName")
    private String fullName;

    @Builder
    public AuthResponseDTO(Long id, String email, String fullName) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
    }
}
