# EventsUi

Este proyecto está basado en el de Francisco Toro Mateo, salvo que el backend es una infraestructura serverless en AWS. Las diferencias son las siguientes:

* Para poder ver los eventos, necesitas estar autenticado.
* Se han modificado algunos modelos.
* Para conectarse a la API, añade una APIKey y el accessToken de usuario.
* El login se ha implementado, conectándose a Cognito.
* Se ha cambiado para que la app siga el patrón *build once, deploy everywhere*, es decir, hay un fichero de configuración externo que se obtiene una ver compilada.

## Credits
By alfabetical order
* Jos Galiano

