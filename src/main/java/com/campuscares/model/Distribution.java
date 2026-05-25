package com.campuscares.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "distributions")
public class Distribution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recipient_name", nullable = false)
    private String recipientName;

    @Column(name = "recipient_email", nullable = false)
    private String recipientEmail;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "quantity_released", nullable = false)
    private Integer quantityReleased;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "distributed_at", nullable = false, updatable = false)
    private Instant distributedAt;

    @PrePersist
    void onCreate() {
        if (distributedAt == null) {
            distributedAt = Instant.now();
        }
    }

    public Long getId() {
        return id;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public Integer getQuantityReleased() {
        return quantityReleased;
    }

    public void setQuantityReleased(Integer quantityReleased) {
        this.quantityReleased = quantityReleased;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public Instant getDistributedAt() {
        return distributedAt;
    }
}
