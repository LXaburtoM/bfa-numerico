package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class SubtestNumerico {
    @Id @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(length = 32) @Hidden
    private String id;

    @Required @Column(length = 100)
    private String nombre;

    @Required
    private Integer tiempoLimite;

    @Required
    private Integer totalItems;

    public abstract double calcularPuntajeDirecto(int aciertos, int errores);
    // Getters y Setters...
}