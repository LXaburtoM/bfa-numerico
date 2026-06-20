package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Entidad núcleo que consolida el resultado de un subtest aplicado a un evaluado.
 * Ya no depende de SubtestNumerico/N1Operaciones/N2Problemas: el tipo de prueba
 * se indica directamente con el enum TipoTest, y el cálculo de puntaje se
 * resuelve aquí mismo según ese tipo.
 */
@Entity
@Table(name = "resultado_numerico")
@Getter @Setter
public class ResultadoNumerico {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(length = 32)
    @Hidden
    private String idResultado;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @DescriptionsList(descriptionProperties = "nombre, apellido")
    private EstudianteEvaluado evaluado;

    @Required
    private TipoTest tipoTest;

    @Required
    private Integer aciertos;

    @Required
    private Integer errores;

    @Required
    private Integer omisiones; // preguntas no respondidas (ni acierto ni error)

    @ReadOnly
    private Double puntajeDirecto;

    @ReadOnly
    private Integer percentil;

    @PrePersist
    @PreUpdate
    public void procesarResultado() {
        if (aciertos < 0 || errores < 0 || omisiones < 0) {
            throw new IllegalArgumentException("Las métricas no pueden ser negativas.");
        }
        this.puntajeDirecto = calcularPuntajeDirecto();
        convertirBaremosAPercentil();
    }

    private double calcularPuntajeDirecto() {
        if (tipoTest == TipoTest.N1_OPERACIONES) {
            return aciertos; // N1: solo aciertos
        }
        return aciertos - (errores * 0.25); // N2: penaliza error
    }

    private void convertirBaremosAPercentil() {
        if (evaluado == null || puntajeDirecto == null) {
            this.percentil = 0;
            return;
        }
        int edad = evaluado.getEdad();
        if (edad <= 12) percentil = (int) (puntajeDirecto * 3.5);
        else if (edad <= 15) percentil = (int) (puntajeDirecto * 2.8);
        else percentil = (int) (puntajeDirecto * 2.1);

        if (percentil > 99) percentil = 99;
        if (percentil < 1) percentil = 1;
    }

    public enum TipoTest { N1_OPERACIONES, N2_PROBLEMAS }
}