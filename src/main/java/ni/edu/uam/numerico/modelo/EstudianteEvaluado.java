package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.util.Date;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

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
    @Column(length = 80)
    private String nombre;

    @Required
    @Column(length = 80)
    private String apellido;

    @Required
    @Min(value = 18, message = "El evaluado debe ser mayor de edad.")
    @Max(value = 120)
    private Integer edad;

    @Required
    @Temporal(TemporalType.DATE)
    private Date fechaIngreso;

    @Column(length = 150)
    @Pattern(regexp = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", message = "Correo inválido, debe contener @.")
    private String correoElectronico;

    @Required
    @Enumerated(EnumType.STRING)
    private Sexo sexo;

    public enum Sexo { M, F }
}