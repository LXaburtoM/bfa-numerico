package ni.edu.uam.psicologia.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;

/**
 * Entidad núcleo del negocio que procesa las respuestas consolidadas, calcula
 * automáticamente los puntajes matemáticos y convierte las métricas crudas a percentiles.
 * * @author Estudiantes de Ingeniería en Sistemas
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

    /** Vínculo directo al alumno evaluado. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @DescriptionsList(descriptionProperties = "nombreCompleto")
    private EstudianteEvaluado evaluado;

    /** Vínculo polimórfico al Subtest aplicado (pueden ser instancias de N1 o N2). */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @DescriptionsList(descriptionProperties = "nombre")
    private SubtestNumerico subtestAplicado;

    /** Total de ítems correctos. */
    @Required
    private Integer aciertos;

    /** Total de ítems incorrectos. */
    @Required
    private Integer errores;

    /** Total de ítems dejados en blanco por el evaluado. */
    @Required
    private Integer omisiones;

    /** Puntaje crudo calculado automáticamente por código. */
    @ReadOnly
    private Double puntajeDirecto;

    /** Valor estandarizado definitivo derivado de las tablas psicométricas. */
    @ReadOnly
    private Integer percentil;

    /**
     * Interceptor del ciclo de vida JPA. Valida las métricas numéricas antes de
     * escribir en PostgreSQL y ejecuta los cálculos matemáticos dinámicos correspondientes.
     * * @throws IllegalArgumentException Si se ingresan valores negativos en las métricas.
     */
    @PrePersist
    @PreUpdate
    public void procesarResultado() {
        // Control de Excepciones Obligatorio exigido en la rúbrica
        if (this.aciertos < 0 || this.errores < 0 || this.omisiones < 0) {
            throw new IllegalArgumentException("Las métricas de la prueba (aciertos, errores, omisiones) no pueden tener valores negativos.");
        }

        if (this.subtestAplicado != null) {
            // Polimorfismo en acción: Invoca la fórmula adecuada (sea N1 o N2)
            this.puntajeDirecto = this.subtestAplicado.calcularPuntajeDirecto(this.aciertos, this.errores);
            convertirBaremosAPercentil();
        }
    }

    /**
     * Algoritmo encargado de procesar la edad del sujeto e indexar automáticamente el baremo.
     * Resuelve el problema de la consulta a tablas impresas descrito en la Fase I.
     */
    private void convertirBaremosAPercentil() {
        if (this.evaluado == null || this.puntajeDirecto == null) {
            this.percentil = 0;
            return;
        }

        int edadEstudiante = this.evaluado.getEdad();

        // Simulación lógica de matriz de baremos automatizada basada en la edad
        if (edadEstudiante <= 12) {
            this.percentil = (int) (this.puntajeDirecto * 3.5);
        } else if (edadEstudiante <= 15) {
            this.percentil = (int) (this.puntajeDirecto * 2.8);
        } else {
            this.percentil = (int) (this.puntajeDirecto * 2.1);
        }

        // Acotación de límites psicométricos estándares (Percentiles 1 a 99)
        if (this.percentil > 99) this.percentil = 99;
        if (this.percentil < 1) this.percentil = 1;
    }

    // --- GETTERS Y SETTERS CORREGIDOS ---

    public String getIdResultado() { return idResultado; }
    public void setIdResultado(String idResultado) { this.idResultado = idResultado; }

    public EstudianteEvaluado getEvaluado() { return evaluado; }
    // LINEA CORREGIDA AQUÍ (Cambiado EstudianteEvaluated por EstudianteEvaluado)
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