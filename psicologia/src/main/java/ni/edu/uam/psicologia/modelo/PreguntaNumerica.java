package ni.edu.uam.psicologia.modelo;
import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
@Entity
@Table(name = "PreguntaNumerica")
public class PreguntaNumerica {
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(length = 32)
    @Hidden
    private String id;
    @Required
    @Column(name = "numero_ejercicio")
    private Integer numeroEjercicio;
    @Required
    private TipoPrueba tipoPrueba;
    public enum TipoPrueba { N1_OPERACIONES, N2_PROBLEMAS }
    @Required
    @Stereotype("TEXT_AREA")
    private String enunciado;
    @Required
    @Column(length = 100)
    private String opcionA;
    @Required
    @Column(length = 100)
    private String opcionB;
    @Required
    @Column(length = 100)
    private String opcionC;
    @Required
    @Column(length = 100)
    private String opcionD;
    @Required
    @Column(length = 100)
    private String opcionE;
    @Required
    private Opcion respuestaCorrecta;
    public enum Opcion { A, B, C, D, E }
    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Integer getNumeroEjercicio() { return numeroEjercicio; }
    public void setNumeroEjercicio(Integer numeroEjercicio) { this.numeroEjercicio = numeroEjercicio; }
    public TipoPrueba getTipoPrueba() { return tipoPrueba; }
    public void setTipoPrueba(TipoPrueba tipoPrueba) { this.tipoPrueba = tipoPrueba; }
    public String getEnunciado() { return enunciado; }
    public void setEnunciado(String enunciado) { this.enunciado = enunciado; }
    public String getOpcionA() { return opcionA; }
    public void setOpcionA(String opcionA) { this.opcionA = opcionA; }
    public String getOpcionB() { return opcionB; }
    public void setOpcionB(String opcionB) { this.opcionB = opcionB; }
    public String getOpcionC() { return opcionC; }
    public void setOpcionC(String opcionC) { this.opcionC = opcionC; }
    public String getOpcionD() { return opcionD; }
    public void setOpcionD(String opcionD) { this.opcionD = opcionD; }
    public String getOpcionE() { return opcionE; }
    public void setOpcionE(String opcionE) { this.opcionE = opcionE; }
    public Opcion getRespuestaCorrecta() { return respuestaCorrecta; }
    public void setRespuestaCorrecta(Opcion respuestaCorrecta) { this.respuestaCorrecta = respuestaCorrecta; }
}
