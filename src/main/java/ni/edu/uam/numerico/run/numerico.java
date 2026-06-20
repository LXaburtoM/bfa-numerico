package ni.edu.uam.numerico.run;

import org.openxava.util.*;

/**
 * haciendo inserts
 */

public class numerico {

	public static void main(String[] args) throws Exception {
		//DBServer.start("numerico-db"); // Para usar tu propia base de datos comenta esta línea y configura src/main/webapp/META-INF/context.xml
		AppServer.run("numerico"); // Usa AppServer.run("") para funcionar en el contexto raíz
	}

}
