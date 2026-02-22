package com.flexpay.order.service;

import com.flexpay.order.model.Order;
import com.flexpay.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    @Transactional
    public Order createOrder(Long consumerId, Long productId, Long merchantId, BigDecimal amount, int installmentsCount) {
        Order order = new Order();
        order.setConsumerId(consumerId);
        order.setProductId(productId);
        order.setMerchantId(merchantId);
        order.setTotalAmount(amount);
        order.setStatus("ACTIVE");
        
        BigDecimal installmentAmount = amount.divide(BigDecimal.valueOf(installmentsCount), 2, RoundingMode.HALF_UP);
        
        order.setInstallments(new ArrayList<>());
        for (int i = 0; i < installmentsCount; i++) {
            Installment inst = new Installment();
            inst.setOrder(order);
            inst.setAmount(installmentAmount);
            inst.setDueDate(LocalDate.now().plusMonths(i));
            inst.setStatus(i == 0 ? "PAID" : "PENDING");
            order.getInstallments().add(inst);
        }

        return orderRepository.save(order);
    }
}
