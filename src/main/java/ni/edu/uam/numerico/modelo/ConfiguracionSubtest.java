package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Configuración única por tipo de subtest (N1 o N2).
 * totalPreguntas ya no se escribe a mano: se calcula en vivo
 * contando las preguntas reales cargadas en cada banco.
 */
@Entity
@Table(name = "configuracion_subtest")
@Getter @Setter
public class ConfiguracionSubtest {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(length = 32)
    @Hidden
    private String idConfiguracion;

    @Required
    @Enumerated(EnumType.STRING)
    @Column(unique = true, length = 20)
    private TipoTest tipoTest;

    @Required
    @Column(length = 100)
    private String nombre;

    @Required
    private Integer tiempoLimiteMinutos;

    @Formula("(CASE WHEN tipotest = 'N1_OPERACIONES' " +
            " THEN (SELECT COUNT(*) FROM pregunta_operacion) " +
            " ELSE (SELECT COUNT(*) FROM pregunta_problema) END)")
    @ReadOnly
    private Integer totalPreguntas;

    public enum TipoTest { N1_OPERACIONES, N2_PROBLEMAS }
}