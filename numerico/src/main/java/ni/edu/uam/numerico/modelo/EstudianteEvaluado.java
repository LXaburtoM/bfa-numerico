package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;

/**
 * Entidad encargada de modelar los datos personales del estudiante que realiza los subtests.
 * @author Estudiantes de Ingeniería en Sistemas
 * @version 1.0
 */
@Entity
@Table(name = "estudiante_evaluado")
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

    public String getIdEstudiante() {
        return idEstudiante;
    }

    public void setIdEstudiante(String idEstudiante) {
        this.idEstudiante = idEstudiante;
    }

    public String getIdentificacion() {
        return identificacion;
    }

    public void setIdentificacion(String identificacion) {
        this.identificacion = identificacion;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public Integer getEdad() {
        return edad;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
    }
}