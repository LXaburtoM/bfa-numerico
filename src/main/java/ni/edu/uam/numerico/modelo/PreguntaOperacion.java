package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Reactivo del Subtest N1 (operaciones aritméticas).
 * Incorpora la configuración del subtest junto a cada reactivo
 * para mantener una sola tabla por tipo de prueba.
 */
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

    @Required
    private Integer orden;

    @Required
    @Column(length = 100)
    private String nombreSubtest; // ej. "Subtest N1 - Operaciones Aritméticas"

    @Required
    private Integer tiempoLimiteMinutos;

    @Required
    private Integer totalPreguntas;

    @Required
    @Stereotype("TEXT_AREA")
    @Column(length = 1000)
    private String tipoOperaciones; // descripción amplia del tipo de operación (suma, resta, series, etc.)

    @Required
    @Stereotype("TEXT_AREA")
    private String enunciado;

    @Required
    @Column(length = 1)
    private String respuestaCorrecta;
}