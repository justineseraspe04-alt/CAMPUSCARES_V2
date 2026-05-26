package com.campuscares.util;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public final class PickupReferenceGenerator {
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final char[] ALPHANUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".toCharArray();
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.BASIC_ISO_DATE;

    private PickupReferenceGenerator() {
    }

    public static String generatePickupReferenceNumber() {
        String datePart = LocalDate.now().format(DATE_FORMAT);
        return "CC-PU-" + datePart + "-" + randomSuffix(6);
    }

    private static String randomSuffix(int length) {
        StringBuilder builder = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            builder.append(ALPHANUM[RANDOM.nextInt(ALPHANUM.length)]);
        }
        return builder.toString();
    }
}
