package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Clase abstracta que define propiedades comunes de los subtests.
 * @author Estudiantes de Ingeniería en Sistemas
 * @version 2.0
 */
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "subtest_numerico")
@Getter @Setter
public abstract class SubtestNumerico {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(length = 32)
    @Hidden
    private String idSubtest;

    @Required
    @Column(length = 100)
    private String nombre;

    @Required
    private Integer tiempoLimite;

    @Required
    private Integer totalItems;

    public abstract double calcularPuntajeDirecto(int aciertos, int errores);
}
