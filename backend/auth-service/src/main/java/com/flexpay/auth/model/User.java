package com.flexpay.auth.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;
    private String password;
    private String role; // CONSUMER, MERCHANT, ADMIN
    
    private BigDecimal creditLimit;
    private String status; // ACTIVE, SUSPENDED
    
    private LocalDateTime createdAt;
}
