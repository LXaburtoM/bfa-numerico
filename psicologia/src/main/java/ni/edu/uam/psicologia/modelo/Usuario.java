package ni.edu.uam.psicologia.modelo;
import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;

/**
 * Entidad que representa a los usuarios del sistema.
 * Permite gestionar las credenciales y los niveles de acceso dentro de la aplicación.
 * * @author Estudiantes de Ingeniería en Sistemas
 * @version 1.0
 */
@Entity
@Table(name = "usuario")
public class Usuario {
    /** Identificador único universal del usuario de 32 caracteres. */
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(length = 32)
    @Hidden
    private String id;

    /** Nombre de usuario único para el inicio de sesión. */
    @Required
    @Column(length = 50, unique = true)
    private String username;

    /** Contraseña encriptada para el acceso seguro. */
    @Required
    @Column(length = 100)
    @Stereotype("PASSWORD")
    private String password;

    /** Rol asignado que define los permisos dentro del sistema. */
    @Required
    private Rol rol;

    /**
     * Enumeración que define los roles permitidos en el sistema.
     */
    public enum Rol {
        /** Acceso total al Back-Office y configuraciones. */
        ADMINISTRADOR,
        /** Acceso a la corrección y visualización de resultados. */
        PSICOLOGO,
        /** Acceso exclusivo para realizar la prueba en el Front-End. */
        SUJETO
    }

    /**
     * Obtiene el identificador único del usuario.
     * @return El ID de 32 caracteres.
     */
    public String getId() { return id; }

    /**
     * Establece el identificador del usuario.
     * @param id El ID único de 32 caracteres.
     */
    public void setId(String id) { this.id = id; }

    /**
     * Obtiene el nombre de usuario.
     * @return El nombre de usuario en formato de texto.
     */
    public String getUsername() { return username; }

    /**
     * Establece el nombre de usuario.
     * @param username El nombre de usuario único.
     */
    public void setUsername(String username) { this.username = username; }

    /**
     * Obtiene la contraseña del usuario.
     * @return La contraseña en formato de texto o hash.
     */
    public String getPassword() { return password; }

    /**
     * Establece la contraseña del usuario.
     * @param password La contraseña del usuario.
     */
    public void setPassword(String password) { this.password = password; }

    /**
     * Obtiene el rol asignado al usuario.
     * @return El rol de la enumeración Rol.
     */
    public Rol getRol() { return rol; }

    /**
     * Establece el rol del usuario.
     * @param rol El rol correspondiente del catálogo.
     */
    public void setRol(Rol rol) { this.rol = rol; }
}

