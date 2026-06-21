package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Configuración única por tipo de subtest (N1 o N2).
 * Aquí vive lo que describe al subtest como grupo: nombre, tiempo límite
 * y total de preguntas. No se repite por cada reactivo.
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
    @Column(unique = true)
    private TipoTest tipoTest;

    @Required
    @Column(length = 100)
    private String nombre; // ej. "Subtest N1 - Operaciones Aritméticas"

    @Required
    private Integer tiempoLimiteMinutos;

    @Required
    private Integer totalPreguntas;

    public enum TipoTest { N1_OPERACIONES, N2_PROBLEMAS }
}