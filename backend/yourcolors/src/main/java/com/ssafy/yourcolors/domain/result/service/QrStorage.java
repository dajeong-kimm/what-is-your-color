package com.ssafy.yourcolors.domain.result.service;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Scope("singleton")
public class QrStorage {
//    private final Map<String, Map<String, String>> storage = new HashMap<>();
private final Map<String, Map<String, String>> storage = new ConcurrentHashMap<>();


    public void save(String qrId, Map<String, String> data) {
        storage.put(qrId, data);
    }

    public Map<String, String> findById(String qrId) {
        return storage.get(qrId);
    }

    public boolean contains(String qrId) {
//        System.out.println("storage = " + storage);
        return storage.containsKey(qrId);
    }
}
