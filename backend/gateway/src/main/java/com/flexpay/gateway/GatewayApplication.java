package com.flexpay.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("auth-service", r -> r.path("/api/auth/**")
                .uri("lb://auth-service"))
            .route("merchant-service", r -> r.path("/api/merchant/**")
                .uri("lb://merchant-service"))
            .route("order-service", r -> r.path("/api/order/**")
                .uri("lb://order-service"))
            .route("payment-service", r -> r.path("/api/payment/**")
                .uri("lb://payment-service"))
            .build();
    }
}
