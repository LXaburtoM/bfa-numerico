package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Reactivos aritméticos del Subtest N1.
 * @author Estudiantes de Ingeniería en Sistemas
 * @version 2.0
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
    @Stereotype("TEXT_AREA")
    private String enunciado;

    @Required
    @Column(length = 1)
    private String respuestaCorrecta;

    @ManyToOne(fetch = FetchType.LAZY)
    @DescriptionsList(descriptionProperties = "nombre")
    private N1Operaciones subtestN1;
}