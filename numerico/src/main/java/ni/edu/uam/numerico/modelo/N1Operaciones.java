package ni.edu.uam.numerico.modelo;
import javax.persistence.*;
import org.openxava.annotations.*;

/**
 * Representa específicamente el Subtest N1 orientado al cálculo y velocidad aritmética.
 * @author Estudiantes de Ingeniería en Sistemas
 * @version 1.0
 */
@Entity
@Table(name = "n1_operaciones")
public class N1Operaciones extends SubtestNumerico {

    @Required
    @Column(length = 50)
    private String tipoOperaciones;

    /**
     * Aplica la fórmula estricta para el subtest N1: Aciertos directos.
     */
    @Override
    public double calcularPuntajeDirecto(int aciertos, int errores) {
        return aciertos;
    }

    public String getTipoOperaciones() { return tipoOperaciones; }
    public void setTipoOperaciones(String tipoOperaciones) { this.tipoOperaciones = tipoOperaciones; }
}
