package ni.edu.uam.numerico.modelo;

import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;
import javax.persistence.*;
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
    @Stereotype("TEXT_AREA")
    @Column(length = 1000)
    private String tipoOperaciones; // descripción del tipo de operación (suma, resta, series, etc.)

    @Required
    @Stereotype("TEXT_AREA")
    private String enunciado;

    @Required
    @Column(length = 3)
    private String respuestaCorrecta;
}