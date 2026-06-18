package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Representa específicamente el Subtest N2.
 * @author Estudiantes de Ingeniería en Sistemas
 * @version 2.0
 */
@Entity
@Table(name = "n2_problemas")
@Getter @Setter
public class N2Problemas extends SubtestNumerico {

    @Required
    @Column(length = 50)
    private String nivelDificultad;

    @Override
    public double calcularPuntajeDirecto(int aciertos, int errores) {
        return aciertos - (errores * 0.25);
    }
}
