package com.flexpay.payment.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // PAYMENT, PAYOUT, FEE
    private Long referenceId; // Order ID or Payout ID
    private BigDecimal amount;
    private String status; // SUCCESS, FAILED, PENDING
    private LocalDateTime createdAt;
}

@Entity
@Table(name = "payouts")
@Data
class Payout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long merchantId;
    private BigDecimal amount;
    private String status; // SCHEDULED, COMPLETED
    private LocalDateTime scheduledDate;
}
