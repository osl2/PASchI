package edu.kit.informatik;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Hauptklasse zum Starten des Backends.
 *
 * @author ugqbo
 * @version 1.0
 */
@SpringBootApplication
public class PAschIApplication {
    /**
     * Hauptmethode zum Starten des Backends.
     * @param args übergebene Parameter -> sollen leer sein
     */
    public static void main(String[] args) {
        SpringApplication.run(PAschIApplication.class, args);
    }

}
