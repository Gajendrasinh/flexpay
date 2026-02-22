package com.flexpay.order.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long consumerId;
    private Long merchantId;
    private Long productId;
    
    private BigDecimal totalAmount;
    private String status; // ACTIVE, COMPLETED, DEFAULTED
    
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<Installment> installments;
}

@Entity
@Table(name = "installments")
@Data
class Installment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private BigDecimal amount;
    private LocalDate dueDate;
    private String status; // PENDING, PAID, OVERDUE
    private LocalDateTime paidAt;
}
