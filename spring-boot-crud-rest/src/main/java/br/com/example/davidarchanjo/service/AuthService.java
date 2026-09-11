package br.com.example.davidarchanjo.service;

import br.com.example.davidarchanjo.model.dto.AuthResponseDTO;
import br.com.example.davidarchanjo.model.dto.LoginRequestDTO;
import br.com.example.davidarchanjo.model.dto.SignupRequestDTO;

public interface AuthService {

    AuthResponseDTO signup(SignupRequestDTO dto);

    AuthResponseDTO login(LoginRequestDTO dto);
}
