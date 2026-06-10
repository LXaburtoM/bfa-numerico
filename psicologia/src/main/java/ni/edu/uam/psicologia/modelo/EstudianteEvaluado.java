package ni.edu.uam.psicologia.modelo;
import javax.persistence.*;
import org.openxava.annotations.*;
import java.time.LocalDate;
import java.time.Period;
@Entity
@Table(name = "EstudianteEvaluado")
public class EstudianteEvaluado {
    @Id
    @Column(length = 15)
    @Required
    private String identificacion;
    @Column(length = 50)
    @Required
    private String nombres;
    @Column(length = 50)
    @Required
    private String apellidos;
    @Required
    private LocalDate fechaNacimiento;
    @Required
    private Sexo sexo;
    public enum Sexo { MASCULINO, FEMENINO, OTRO }
    @Depends("fechaNacimiento")
    public int getEdad() {
        if (fechaNacimiento == null) return 0;
        return Period.between(fechaNacimiento, LocalDate.now()).getYears();
    }
    // Getters y Setters
    public String getIdentificacion() { return identificacion; }
    public void setIdentificacion(String identificacion) { this.identificacion = identificacion; }
    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }
    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }
    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    public Sexo getSexo() { return sexo; }
    public void setSexo(Sexo sexo) { this.sexo = sexo; }

}
