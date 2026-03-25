package vn.thuyphominh.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.thuyphominh.backend.dto.UserCreateRequest;
import vn.thuyphominh.backend.dto.UserDto;
import vn.thuyphominh.backend.dto.UserUpdateRequest;
import vn.thuyphominh.backend.entity.User;
import vn.thuyphominh.backend.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<UserDto> searchUsers(String keyword) {
        return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword, org.springframework.data.domain.Pageable.unpaged())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public UserDto createUser(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .status(request.getStatus())
                .build();

        return mapToDto(userRepository.save(user));
    }

    @Override
    public UserDto updateUser(Long id, UserUpdateRequest request, String currentUserEmail) {
        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        boolean isSelf = targetUser.getEmail().equals(currentUserEmail);

        if (!isSelf && targetUser.getRole() == vn.thuyphominh.backend.entity.Role.ADMIN) {
            throw new IllegalArgumentException("Cannot modify another ADMIN's account");
        }

        if (isSelf && request.getRole() != null && request.getRole() != targetUser.getRole()) {
            throw new IllegalArgumentException("Cannot change your own role");
        }

        if (!targetUser.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        targetUser.setName(request.getName());
        targetUser.setEmail(request.getEmail());
        
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            targetUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getRole() != null) targetUser.setRole(request.getRole());
        if (request.getStatus() != null) targetUser.setStatus(request.getStatus());

        return mapToDto(userRepository.save(targetUser));
    }

    @Override
    public void deleteUser(Long id, String currentUserEmail) {
        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        boolean isSelf = targetUser.getEmail().equals(currentUserEmail);

        if (isSelf) {
            throw new IllegalArgumentException("Cannot delete your own account");
        }

        if (targetUser.getRole() == vn.thuyphominh.backend.entity.Role.ADMIN) {
            throw new IllegalArgumentException("Cannot delete another ADMIN's account");
        }

        if (targetUser.getRole() == vn.thuyphominh.backend.entity.Role.ADMIN && userRepository.countByRole(vn.thuyphominh.backend.entity.Role.ADMIN) <= 1) {
            throw new IllegalArgumentException("Cannot delete the last ADMIN in the system");
        }

        userRepository.deleteById(id);
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .build();
    }
}
