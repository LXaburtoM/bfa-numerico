package ni.edu.uam.psicologia.run;

import org.openxava.util.*;

/**
 * Ejecuta esta clase para arrancar la aplicación.
 */

public class psicologia {

	public static void main(String[] args) throws Exception {
		// DBServer.start("psicologia-db"); // Para usar tu propia base de datos comenta esta línea y configura src/main/webapp/META-INF/context.xml
		AppServer.run("psicologia"); // Usa AppServer.run("") para funcionar en el contexto raíz
	}

}
