package ni.edu.uam.psicologia.modelo;
import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.openxava.annotations.*;
import java.time.LocalDate;
import java.util.Collection;
@Entity
@Table(name = "TestNumerico")
public class TestNumerico {
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(length = 32)
    @Hidden
    private String id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @DescriptionsList(descriptionProperties = "nombres, apellidos, identificacion")
    @Required
    private EstudianteEvaluado estudiante;
    @Required
    private LocalDate fecha = LocalDate.now();
    @OneToMany(mappedBy = "testNumerico", cascade = CascadeType.ALL, orphanRemoval = true)
    @ListProperties("pregunta.numeroEjercicio, pregunta.tipoPrueba, opcionSeleccionada, esCorrecta")
    private Collection<RespuestaEstudiante> respuestas;
    @ReadOnly
    private int notaN1;
    @ReadOnly
    private int notaN2;
    @ReadOnly
    private int notaNT;
    @PrePersist
    @PreUpdate
    public void calcularNotas() {
        int aciertosN1 = 0;
        int erroresN1 = 0;
        int aciertosN2 = 0;
        if (respuestas != null) {
            for (RespuestaEstudiante r : respuestas) {
                if (r.getPregunta() != null) {
                    boolean correcta = r.isEsCorrecta();

                    if (r.getPregunta().getTipoPrueba() == PreguntaNumerica.TipoPrueba.N1_OPERACIONES) {
                        if (correcta) {
                            aciertosN1++;
                        } else if (r.getOpcionSeleccionada() != null) {
                            erroresN1++;
                        }
                    } else if (r.getPregunta().getTipoPrueba() == PreguntaNumerica.TipoPrueba.N2_PROBLEMAS) {
                        if (correcta) {
                            aciertosN2++;
                        }
                    }
                }
            }
        }
        this.notaN1 = Math.max(0, aciertosN1 - erroresN1);
        this.notaN2 = aciertosN2;
        this.notaNT = this.notaN1 + this.notaN2;
    }
    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public EstudianteEvaluado getEstudiante() { return estudiante; }
    public void setEstudiante(EstudianteEvaluado estudiante) { this.estudiante = estudiante; }
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    public Collection<RespuestaEstudiante> getRespuestas() { return respuestas; }
    public void setRespuestas(Collection<RespuestaEstudiante> respuestas) { this.respuestas = respuestas; }
    public int getNotaN1() { return notaN1; }
    public void setNotaN1(int notaN1) { this.notaN1 = notaN1; }
    public int getNotaN2() { return notaN2; }
    public void setNotaN2(int notaN2) { this.notaN2 = notaN2; }
    public int getNotaNT() { return notaNT; }
    public void setNotaNT(int notaNT) { this.notaNT = notaNT; }
}


