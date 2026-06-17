package ni.edu.uam.numerico.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;

/**
 * Entidad encargada del almacenamiento de los casos lógicos del Subtest N2.
 * @author Estudiantes de Ingeniería en Sistemas
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

    @Required
    @Stereotype("TEXT_AREA")
    private String contexto;

    @Required
    @Stereotype("TEXT_AREA")
    private String enunciado;

    @Required
    @Column(length = 1)
    private String respuestaCorrecta;

    @ManyToOne(fetch = FetchType.LAZY)
    @DescriptionsList
    private N2Problemas subtestN2;

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