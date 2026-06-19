package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Entidad que representa a los usuarios del sistema.
 * @author Estudiantes de Ingeniería en Sistemas
 * @version 2.0
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
    private Rol rol;

    public enum Rol { ADMINISTRADOR, PSICOLOGO, SUJETO }
}
