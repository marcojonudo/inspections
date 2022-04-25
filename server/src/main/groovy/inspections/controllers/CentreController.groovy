package inspections.controllers

import groovy.transform.CompileStatic
import inspections.domains.fviberi.Centre
import inspections.services.data.CentreDataService
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/centres")
@CompileStatic
class CentreController {

	@Inject private CentreDataService centreDataService

	@Get
	@Operation(
		summary = "Obtiene el centro",
		description = "Obtiene el centro"
	)
	@ApiResponse(
		responseCode = "200",
		description = "Número de orden encontrado",
		content = @Content(mediaType = "application/json", schema = @Schema(implementation = Centre))
	)
	@ApiResponse(
		responseCode = "404", description = "Número de orden no encontrado"
	)
	Centre get() {
		return centreDataService.find()
	}

}
