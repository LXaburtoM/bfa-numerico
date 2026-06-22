package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

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
    @Column(length = 20)
    private TipoTest tipoTest;

    @Required
    @Column(length = 100)
    private String nombre;

    @Required
    private Integer tiempoLimiteMinutos; // 6 según el manual real, pero editable por si cambias de instrumento

    @Formula("(CASE WHEN tipotest = 'N1_OPERACIONES' " +
            " THEN (SELECT COUNT(*) FROM pregunta_operacion po WHERE po.subtest_id = idconfiguracion) " +
            " ELSE (SELECT COUNT(*) FROM pregunta_problema pp WHERE pp.subtest_id = idconfiguracion) END)")
    @ReadOnly
    private Integer totalPreguntas;

    public enum TipoTest { N1_OPERACIONES, N2_PROBLEMAS }
}