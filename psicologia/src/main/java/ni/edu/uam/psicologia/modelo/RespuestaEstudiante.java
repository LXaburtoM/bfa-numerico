package ni.edu.uam.psicologia.modelo;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
@Entity
@Table(name = "RespuestaEstudiante")
public class RespuestaEstudiante {
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(length = 32)
    @Hidden
    private String id;
    @ManyToOne(fetch = FetchType.LAZY)
    @DescriptionsList(descriptionProperties = "numeroEjercicio, tipoPrueba")
    @Required
    private PreguntaNumerica pregunta;
    private PreguntaNumerica.Opcion opcionSeleccionada;
    @ManyToOne(fetch = FetchType.LAZY)
    private TestNumerico testNumerico;
    @Depends("pregunta.respuestaCorrecta, opcionSeleccionada")
    public boolean isEsCorrecta() {
        if (pregunta == null || opcionSeleccionada == null) {
            return false;
        }
        return pregunta.getRespuestaCorrecta() == opcionSeleccionada;
    }
    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public PreguntaNumerica getPregunta() { return pregunta; }
    public void setPregunta(PreguntaNumerica pregunta) { this.pregunta = pregunta; }
    public PreguntaNumerica.Opcion getOpcionSeleccionada() { return opcionSeleccionada; }
    public void setOpcionSeleccionada(PreguntaNumerica.Opcion opcionSeleccionada) { this.opcionSeleccionada = opcionSeleccionada; }
    public TestNumerico getTestNumerico() { return testNumerico; }
    public void setTestNumerico(TestNumerico testNumerico) { this.testNumerico = testNumerico; }

}
