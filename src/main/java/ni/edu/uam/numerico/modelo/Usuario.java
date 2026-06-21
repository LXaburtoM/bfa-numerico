package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Usuario administrador. Ahora con uso real: queda referenciado en
 * ResultadoNumerico como quien capturó el resultado.
 * El password se hashea en SHA-256 antes de guardar (para producción
 * real se recomienda BCrypt, pero requiere una dependencia adicional).
 */
@Entity
@Table(name = "usuario")
@Getter @Setter
public class Usuario {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(length = 32)
    @Hidden
    private String id;

    @Required
    @Column(length = 50, unique = true)
    private String username;

    @Required
    @Column(length = 100)
    @Stereotype("PASSWORD")
    private String password;

    @Required
    @Column(length = 100)
    private String nombreCompleto;

    @PrePersist
    @PreUpdate
    public void hashearPassword() {
        if (password != null && !password.matches("^[a-f0-9]{64}$")) {
            this.password = sha256(password);
        }
    }

    private String sha256(String texto) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(texto.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (NoSuchAlgorithmException | java.io.UnsupportedEncodingException e) {
            throw new RuntimeException("Error al hashear el password.", e);
        }
    }
}