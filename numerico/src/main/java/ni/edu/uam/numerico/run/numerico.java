package ni.edu.uam.numerico.run;

import org.openxava.util.*;

/**
 * Ejecuta esta clase para arrancar la aplicación.
 */

public class numerico {

	public static void main(String[] args) throws Exception {
		DBServer.start("numerico-db"); // Para usar tu propia base de datos comenta esta línea y configura src/main/webapp/META-INF/context.xml
		AppServer.run("numerico"); // Usa AppServer.run("") para funcionar en el contexto raíz
	}

}
