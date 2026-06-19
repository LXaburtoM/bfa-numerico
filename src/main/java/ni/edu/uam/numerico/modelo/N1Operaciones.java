package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Representa específicamente el Subtest N1.
 * @author Estudiantes de Ingeniería en Sistemas
 * @version 2.0
 */
@Entity
@Table(name = "n1_operaciones")
@Getter @Setter
public class N1Operaciones extends SubtestNumerico {

    @Required
    @Column(length = 50)
    private String tipoOperaciones;

    @Override
    public double calcularPuntajeDirecto(int aciertos, int errores) {
        return aciertos;
    }
}
