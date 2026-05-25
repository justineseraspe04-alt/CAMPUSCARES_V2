package com.campuscares.util;

import com.campuscares.enums.ItemCategory;

import java.util.Locale;

public final class CategoryUtil {
    private CategoryUtil() {
    }

    public static ItemCategory toItemCategory(String raw) {
        if (raw == null || raw.isBlank()) {
            return ItemCategory.OTHER;
        }
        String normalized = raw.trim()
                .replace('-', '_')
                .replace(' ', '_')
                .toUpperCase(Locale.ROOT);
        try {
            return ItemCategory.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            return ItemCategory.OTHER;
        }
    }
}

