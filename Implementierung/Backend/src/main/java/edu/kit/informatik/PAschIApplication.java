package edu.kit.informatik;

import edu.kit.informatik.security.RsaKeyProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * Hauptklasse zum Starten des Backends.
 *
 * @author ugqbo
 * @version 1.0
 */

@EnableConfigurationProperties(RsaKeyProperties.class)
@SpringBootApplication
public class PAschIApplication {
    /**
     * Hauptmethode zum Starten des Backends.
     * @param args übergebene Parameter -> sollen leer sein
     *
     */
    public static void main(String[] args) {
        SpringApplication.run(PAschIApplication.class, args);
    }

}
