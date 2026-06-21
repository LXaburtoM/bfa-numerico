package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "pregunta_problema")
@Getter @Setter
public class PreguntaProblema {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(length = 32)
    @Hidden
    private String idPregunta;

    @Required
    private Integer orden;

    @Required
    private NivelDificultad nivelDificultad;

    @Required
    @Stereotype("TEXT_AREA")
    private String contexto;

    @Required
    @Stereotype("TEXT_AREA")
    @Column(length = 1500)
    private String enunciado;

    @Required
    @Column(length = 3)
    private String respuestaCorrecta;

    public enum NivelDificultad { FACIL, MEDIO, DIFICIL }
}