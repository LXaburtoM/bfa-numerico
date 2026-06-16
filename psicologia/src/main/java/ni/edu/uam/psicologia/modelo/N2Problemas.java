package ni.edu.uam.psicologia.modelo;

import javax.persistence.*;
import org.openxava.annotations.*;

/**
 * Representa específicamente el Subtest N2 orientado a la resolución de problemas lógicos.
 * * @author Estudiantes de Ingeniería en Sistemas
 * @version 1.0
 */
@Entity
@Table(name = "n2_problemas")
public class N2Problemas extends SubtestNumerico {

    /** Nivel analítico del subtest (ej. Avanzado, Intermedio). */
    @Required
    @Column(length = 50)
    private String nivelDificultad;

    /**
     * Aplica la fórmula psicométrica clásica para preguntas de selección múltiple (Aciertos - Penas).
     * @return Puntaje corregido.
     */
    @Override
    public double calcularPuntajeDirecto(int aciertos, int errores) {
        return aciertos - (errores * 0.25);
    }

    public String getNivelDificultad() { return nivelDificultad; }
    public void setNivelDificultad(String nivelDificultad) { this.nivelDificultad = nivelDificultad; }
}