package ni.edu.uam.psicologia.modelo;
import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
/**
 * Clase abstracta que define las propiedades y comportamientos comunes de los
 * subtests numéricos de la batería B.F.A.
 * * @author Estudiantes de Ingeniería en Sistemas
 * @version 1.0
 */
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "subtest_numerico")
public abstract class SubtestNumerico {
    /** Identificador clave para la jerarquía relacional de entidades. */
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(length = 32)
    @Hidden
    private String idSubtest;

    /** Nombre comercial o técnico del subtest. */
    @Required
    @Column(length = 100)
    private String nombre;

    /** Tiempo reglamentario de ejecución en minutos. */
    @Required
    private Integer tiempoLimite;

    /** Cantidad total de preguntas asignadas al instrumento. */
    @Required
    private Integer totalItems;

    /**
     * Método polimórfico encargado de definir cómo se procesarán los puntajes.
     * @param aciertos Número de aciertos.
     * @param errores Número de errores.
     * @return El puntaje directo calculado según la fórmula específica del subtest.
     */
    public abstract double calcularPuntajeDirecto(int aciertos, int errores);

    public String getIdSubtest() { return idSubtest; }
    public void setIdSubtest(String idSubtest) { this.idSubtest = idSubtest; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Integer getTiempoLimite() { return tiempoLimite; }
    public void setTiempoLimite(Integer tiempoLimite) { this.tiempoLimite = tiempoLimite; }
    public Integer getTotalItems() { return totalItems; }
    public void setTotalItems(Integer totalItems) { this.totalItems = totalItems; }


}
