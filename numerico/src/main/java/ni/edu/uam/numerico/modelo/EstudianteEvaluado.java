package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Entidad encargada de modelar los datos personales del estudiante.
 * @author Estudiantes de Ingeniería en Sistemas
 * @version 2.0
 */
@Entity
@Table(name = "estudiante_evaluado")
@Getter @Setter
public class EstudianteEvaluado {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(length = 32)
    @Hidden
    private String idEstudiante;

    @Required
    @Column(length = 20, unique = true)
    private String identificacion;

    @Required
    @Column(length = 150)
    private String nombreCompleto;

    @Required
    private Integer edad;
}