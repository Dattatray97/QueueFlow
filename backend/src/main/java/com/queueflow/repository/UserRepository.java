package com.queueflow.repository;

import com.queueflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole(User.Role role);
    List<User> findAllByRoleOrderByCreatedAtDesc(User.Role role);
    List<User> findAllByOrderByCreatedAtDesc();
}
