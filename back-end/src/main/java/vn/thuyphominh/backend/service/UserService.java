package vn.thuyphominh.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.thuyphominh.backend.dto.UserCreateRequest;
import vn.thuyphominh.backend.dto.UserDto;
import vn.thuyphominh.backend.dto.UserUpdateRequest;

import java.util.List;

public interface UserService {
    List<UserDto> getAllUsers();
    List<UserDto> searchUsers(String keyword);
    UserDto createUser(UserCreateRequest request);
    UserDto updateUser(Long id, UserUpdateRequest request, String currentUserEmail);
    void deleteUser(Long id, String currentUserEmail);
}
