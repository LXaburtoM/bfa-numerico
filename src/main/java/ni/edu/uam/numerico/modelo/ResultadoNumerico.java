package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Entidad núcleo del negocio que procesa las respuestas consolidadas.
 * @author Estudiantes de Ingeniería en Sistemas
 * @version 2.0
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
    @DescriptionsList(descriptionProperties = "nombreCompleto")
    private EstudianteEvaluado evaluado;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @DescriptionsList(descriptionProperties = "nombre")
    private SubtestNumerico subtestAplicado;

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
        if (this.aciertos < 0 || this.errores < 0 || this.omisiones < 0) {
            throw new IllegalArgumentException("Las métricas no pueden ser negativas.");
        }

        if (this.subtestAplicado != null) {
            this.puntajeDirecto = this.subtestAplicado.calcularPuntajeDirecto(this.aciertos, this.errores);
            convertirBaremosAPercentil();
        }
    }

    private void convertirBaremosAPercentil() {
        if (this.evaluado == null || this.puntajeDirecto == null) {
            this.percentil = 0;
            return;
        }

        int edadEstudiante = this.evaluado.getEdad();

        if (edadEstudiante <= 12) {
            this.percentil = (int) (this.puntajeDirecto * 3.5);
        } else if (edadEstudiante <= 15) {
            this.percentil = (int) (this.puntajeDirecto * 2.8);
        } else {
            this.percentil = (int) (this.puntajeDirecto * 2.1);
        }

        if (this.percentil > 99) this.percentil = 99;
        if (this.percentil < 1) this.percentil = 1;
    }
}