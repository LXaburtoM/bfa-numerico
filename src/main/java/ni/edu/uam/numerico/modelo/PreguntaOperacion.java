package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "pregunta_operacion")
@Getter @Setter
public class PreguntaOperacion {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(length = 32)
    @Hidden
    private String idPregunta;

    @Generated(GenerationTime.INSERT)
    @Column(insertable = false, updatable = false)
    private Integer orden;

    @Required
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @DescriptionsList(descriptionProperties = "nombre")
    @JoinColumn(name = "subtest_id")
    private ConfiguracionSubtest subtest;

    @Required
    @Stereotype("TEXT_AREA")
    private String enunciado; // ej. "3 + ? = 8"

    @Required @Column(length = 30) private String opcionA;
    @Required @Column(length = 30) private String opcionB;
    @Required @Column(length = 30) private String opcionC;
    @Required @Column(length = 30) private String opcionD;

    @Required
    @Enumerated(EnumType.STRING)
    private RespuestaCorrecta respuestaCorrecta;

    public enum RespuestaCorrecta { A, B, C, D }
}