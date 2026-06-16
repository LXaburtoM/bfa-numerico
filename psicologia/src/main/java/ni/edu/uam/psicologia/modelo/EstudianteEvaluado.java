package ni.edu.uam.psicologia.modelo;
import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;

/**
 * Entidad encargada de modelar los datos personales del estudiante que realiza los subtests.
 * * @author Estudiantes de Ingeniería en Sistemas
 * @version 1.0
 */
@Entity
@Table(name = "estudiante_evaluado")
public class EstudianteEvaluado {

    /** Identificador de 32 caracteres. */
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(length = 32)
    @Hidden
    private String idEstudiante;

    /** Cédula, carnet escolar o código único de identificación. */
    @Required
    @Column(length = 20, unique = true)
    private String identificacion;

    /** Nombre completo del estudiante. */
    @Required
    @Column(length = 150)
    private String nombreCompleto;

    /** Edad cronológica del estudiante, vital para el cálculo psicométrico final. */
    @Required
    private Integer edad;

    /**
     * Obtiene el identificador del estudiante.
     * @return ID único.
     */
    public String getIdEstudiante() { return idEstudiante; }

    /**
     * Establece el identificador del estudiante.
     * @param idEstudiante ID de 32 caracteres.
     */
    public void setIdEstudiante(String idEstudiante) { this.idEstudiante = idEstudiante; }

    /**
     * Obtiene la identificación del estudiante.
     * @return Código o carnet.
     */
    public String getIdentificacion() { return identificacion; }

    /**
     * Establece la identificación única del estudiante.
     * @param identificacion Código de identificación.
     */
    public void setIdentificacion(String identificacion) { this.identificacion = identificacion; }

    /**
     * Obtiene el nombre completo.
     * @return Nombre y apellidos.
     */
    public String getNombreCompleto() { return nombreCompleto; }

    /**
     * Establece el nombre completo del estudiante.
     * @param nombreCompleto Nombre completo.
     */
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    /**
     * Obtiene la edad del estudiante.
     * @return Edad en años.
     */
    public Integer getEdad() { return edad; }

    /**
     * Establece la edad cronológica.
     * @param edad Edad en años.
     */
    public void setEdad(Integer edad) { this.edad = edad; }
}
