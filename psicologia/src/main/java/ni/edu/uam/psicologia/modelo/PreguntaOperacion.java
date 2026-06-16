package ni.edu.uam.psicologia.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;

/**
 * Entidad encargada del almacenamiento de los reactivos aritméticos del Subtest N1.
 * * @author Estudiantes de Ingeniería en Sistemas
 * @version 1.0
 */
@Entity
@Table(name = "pregunta_operacion")
public class PreguntaOperacion {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(length = 32)
    @Hidden
    private String idPregunta;

    /** Número correlativo del ítem en la prueba. */
    @Required
    private Integer orden;

    /** Operación matemática descrita. */
    @Required
    @Stereotype("TEXT_AREA")
    private String enunciado;

    /** Carácter de la respuesta válida (ej. A, B, C, D). */
    @Required
    @Column(length = 1)
    private String respuestaCorrecta;

    /** Relación hacia la entidad del Subtest N1. */
    @ManyToOne(fetch = FetchType.LAZY)
    @DescriptionsList
    private N1Operaciones subtestN1;

    /**
     * Evalúa si una respuesta provista por el estudiante es válida.
     * @param respuestaUsuario Respuesta textual ingresada.
     * @return True si coincide ignorando mayúsculas/minúsculas.
     */
    public boolean esCorrecta(String respuestaUsuario) {
        if (respuestaUsuario == null) return false;
        return this.respuestaCorrecta.equalsIgnoreCase(respuestaUsuario.trim());
    }

    public String getIdPregunta() { return idPregunta; }
    public void setIdPregunta(String idPregunta) { this.idPregunta = idPregunta; }
    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }
    public String getEnunciado() { return enunciado; }
    public void setEnunciado(String enunciado) { this.enunciado = enunciado; }
    public String getRespuestaCorrecta() { return respuestaCorrecta; }
    public void setRespuestaCorrecta(String respuestaCorrecta) { this.respuestaCorrecta = respuestaCorrecta; }
    public N1Operaciones getSubtestN1() { return subtestN1; }
    public void setSubtestN1(N1Operaciones subtestN1) { this.subtestN1 = subtestN1; }
}
