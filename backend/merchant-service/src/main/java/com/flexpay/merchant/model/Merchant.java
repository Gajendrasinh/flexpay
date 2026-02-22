package com.flexpay.merchant.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "merchants")
@Data
public class Merchant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String businessName;
    private String taxId;
    private String bankAccount;
    private String status; // PENDING, APPROVED, REJECTED

    @OneToMany(mappedBy = "merchant", cascade = CascadeType.ALL)
    private List<Product> products;
}

@Entity
@Table(name = "products")
@Data
class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "merchant_id")
    private Merchant merchant;

    private String name;
    private Double price;
    private String category;
    private String image;
    private boolean flexpayEligible;
}
