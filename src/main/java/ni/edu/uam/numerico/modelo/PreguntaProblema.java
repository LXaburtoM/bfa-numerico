package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Reactivo del Subtest N2 (problemas lógicos).
 * Incorpora la configuración del subtest junto a cada reactivo.
 */
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
    @Column(length = 100)
    private String nombreSubtest; // ej. "Subtest N2 - Problemas Lógicos"

    @Required
    private Integer tiempoLimiteMinutos;

    @Required
    private Integer totalPreguntas;

    @Required
    private NivelDificultad nivelDificultad;

    @Required
    @Stereotype("TEXT_AREA")
    private String contexto;

    @Required
    @Stereotype("TEXT_AREA")
    @Column(length = 1500)
    private String enunciado; // cuadro grande para redactar el problema libremente

    @Required
    @Column(length = 1)
    private String respuestaCorrecta;

    public enum NivelDificultad { FACIL, MEDIO, DIFICIL }
}