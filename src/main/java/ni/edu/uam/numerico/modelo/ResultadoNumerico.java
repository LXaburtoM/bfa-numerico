package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

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

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @DescriptionsList(descriptionProperties = "nombre")
    private ConfiguracionSubtest subtest;

    @ManyToOne(fetch = FetchType.LAZY)
    @DescriptionsList(descriptionProperties = "username")
    private Usuario capturadoPor;

    @Required
    private Integer aciertos;

    @Required
    private Integer errores;

    @Required
    private Integer omisiones;

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

        if (subtest != null && subtest.getTotalPreguntas() != null) {
            int totalRespondido = aciertos + errores + omisiones;
            if (totalRespondido > subtest.getTotalPreguntas()) {
                throw new IllegalArgumentException(
                        "Aciertos + errores + omisiones (" + totalRespondido +
                                ") no puede superar el total de preguntas del subtest (" +
                                subtest.getTotalPreguntas() + ")."
                );
            }
        }

        this.puntajeDirecto = calcularPuntajeDirecto();
        convertirBaremosAPercentil();
    }

    private double calcularPuntajeDirecto() {
        if (subtest.getTipoTest() == ConfiguracionSubtest.TipoTest.N1_OPERACIONES) {
            return aciertos;
        }
        return aciertos - (errores * 0.25);
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
}