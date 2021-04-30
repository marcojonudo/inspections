package inspections

import io.micronaut.runtime.Micronaut
import groovy.transform.CompileStatic
import io.swagger.v3.oas.annotations.OpenAPIDefinition
import io.swagger.v3.oas.annotations.info.Contact
import io.swagger.v3.oas.annotations.info.Info

@OpenAPIDefinition(
    info = @Info(
        title = "Revisiones",
        version = "1.0",
        description = "Aplicación que permite escoger y rellenar un tipo de revisión",
        contact = @Contact(name = "Marco", email = "marco.martinez@feuvert.es")
    )
)
@CompileStatic
class Application {
    static void main(String[] args) {
        Micronaut.run(Application, args)
    }
}
