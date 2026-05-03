package org.gramavoice.backend.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class ReferenceNumberService {

    private final AtomicInteger counter = new AtomicInteger(100);

    public String nextReference() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmm"));
        return "GV" + timestamp + counter.getAndIncrement();
    }
}
