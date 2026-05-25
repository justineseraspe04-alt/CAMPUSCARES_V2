package com.campuscares.util;

import com.campuscares.enums.ItemCondition;

public final class ItemConditionUtil {
    private ItemConditionUtil() {
    }

    public static ItemCondition toItemCondition(String raw) {
        if (raw == null || raw.isBlank()) {
            return ItemCondition.WORN;
        }
        String normalized = raw.trim()
                .replace('-', '_')
                .replace(' ', '_')
                .toUpperCase();
        try {
            return ItemCondition.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            if (normalized.contains("SLIGHT") || normalized.contains("LIKE")) {
                return ItemCondition.SLIGHTLY_USED;
            }
            if (normalized.contains("NEW")) {
                return ItemCondition.NEW;
            }
            return ItemCondition.WORN;
        }
    }
}
