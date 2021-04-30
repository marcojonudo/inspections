package inspections.controllers

import groovy.transform.CompileStatic
import inspections.domains.Inspection
import inspections.services.data.InspectionDataService
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@CompileStatic
@Controller("/inspections")
class InspectionController {

	@Inject private InspectionDataService inspectionDataService

	@Get
	@Operation(
		summary = "Obtiene las revisiones",
		description = "Obtiene todas las revisiones"
	)
	@ApiResponse(content = @Content(mediaType = "application/json", schema = @Schema(type = "array")))
	@ApiResponse(
		responseCode = "200",
		description = "Lista de revisiones",
		content = @Content(array = @ArraySchema(schema = @Schema(implementation = Inspection)))
	)
    List<Inspection> getInspections() {
		return inspectionDataService.findAll()
    }

}
