package com.campuscares;

import com.campuscares.config.EnvPropertyInitializer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CampusCaresV2Application {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(CampusCaresV2Application.class);
        app.addInitializers(new EnvPropertyInitializer());
        app.run(args);
    }
}
