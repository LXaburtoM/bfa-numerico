package ni.edu.uam.psicologia.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;

/**
 * Entidad encargada del almacenamiento de los casos lógicos y analíticos del Subtest N2.
 * * @author Estudiantes de Ingeniería en Sistemas
 * @version 1.0
 */
@Entity
@Table(name = "pregunta_problema")
public class PreguntaProblema {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(length = 32)
    @Hidden
    private String idPregunta;

    @Required
    private Integer orden;

    /** Texto explicativo del problema o gráfica simulada. */
    @Required
    @Stereotype("TEXT_AREA")
    private String contexto;

    /** Pregunta clave e instrucciones puntuales. */
    @Required
    @Stereotype("TEXT_AREA")
    private String enunciado;

    @Required
    @Column(length = 1)
    private String respuestaCorrecta;

    /** Relación jerárquica con el Subtest N2. */
    @ManyToOne(fetch = FetchType.LAZY)
    @DescriptionsList
    private N2Problemas subtestN2;

    /**
     * Valida la concordancia de la respuesta.
     * @param respuestaUsuario Respuesta enviada por el evaluado.
     * @return True si es idéntica.
     */
    public boolean esCorrecta(String respuestaUsuario) {
        if (respuestaUsuario == null) return false;
        return this.respuestaCorrecta.equalsIgnoreCase(respuestaUsuario.trim());
    }

    public String getIdPregunta() { return idPregunta; }
    public void setIdPregunta(String idPregunta) { this.idPregunta = idPregunta; }
    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }
    public String getContexto() { return contexto; }
    public void setContexto(String contexto) { this.contexto = contexto; }
    public String getEnunciado() { return enunciado; }
    public void setEnunciado(String enunciado) { this.enunciado = enunciado; }
    public String getRespuestaCorrecta() { return respuestaCorrecta; }
    public void setRespuestaCorrecta(String respuestaCorrecta) { this.respuestaCorrecta = respuestaCorrecta; }
    public N2Problemas getSubtestN2() { return subtestN2; }
    public void setSubtestN2(N2Problemas subtestN2) { this.subtestN2 = subtestN2; }
}