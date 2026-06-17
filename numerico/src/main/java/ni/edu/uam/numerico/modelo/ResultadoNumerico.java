package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;

/**
 * Entidad núcleo del negocio que procesa las respuestas consolidadas, calcula
 * automáticamente los puntajes y convierte las métricas a percentiles.
 * @author Estudiantes de Ingeniería en Sistemas
 * @version 1.0
 */
@Entity
@Table(name = "resultado_numerico")
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
            throw new IllegalArgumentException("Las métricas (aciertos, errores, omisiones) no pueden ser negativas.");
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

        // Aquí es donde marcaba rojo porque EstudianteEvaluado no tenía getEdad()
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

    // Getters y Setters
    public String getIdResultado() { return idResultado; }
    public void setIdResultado(String idResultado) { this.idResultado = idResultado; }
    public EstudianteEvaluado getEvaluado() { return evaluado; }
    public void setEvaluado(EstudianteEvaluado evaluado) { this.evaluado = evaluado; }
    public SubtestNumerico getSubtestAplicado() { return subtestAplicado; }
    public void setSubtestAplicado(SubtestNumerico subtestAplicado) { this.subtestAplicado = subtestAplicado; }
    public Integer getAciertos() { return aciertos; }
    public void setAciertos(Integer aciertos) { this.aciertos = aciertos; }
    public Integer getErrores() { return errores; }
    public void setErrores(Integer errores) { this.errores = errores; }
    public Integer getOmisiones() { return omisiones; }
    public void setOmisiones(Integer omisiones) { this.omisiones = omisiones; }
    public Double getPuntajeDirecto() { return puntajeDirecto; }
    public void setPuntajeDirecto(Double puntajeDirecto) { this.puntajeDirecto = puntajeDirecto; }
    public Integer getPercentil() { return percentil; }
    public void setPercentil(Integer percentil) { this.percentil = percentil; }
}