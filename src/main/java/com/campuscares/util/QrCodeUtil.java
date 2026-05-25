package com.campuscares.util;

import org.springframework.stereotype.Component;

@Component
public class QrCodeUtil {
    public String generateQrCodeText() {
        return "CC-ITEM-" + System.currentTimeMillis();
    }
}
