package com.alexandrecampos.selfcloudstorage;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.annotation.PostConstruct;

@Slf4j
@SpringBootApplication
public class Application {

    @Value("${server.port}")
    private int port;

    @Value("${server.servlet.context-path}")
    private String context;

    @PostConstruct
    private void message() {
        log.info("============================================== Visit");
        log.info("============================================== http://localhost:{}{}/swagger-ui/index.html", port,
                context);
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
