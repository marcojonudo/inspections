package inspections.controllers

import groovy.transform.CompileStatic
import inspections.domains.Inspection
import inspections.services.InspectionService
import inspections.services.data.InspectionDataService
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.QueryValue
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@CompileStatic
@Controller("/inspections")
class InspectionController {

	@Inject private InspectionService inspectionService
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

	@Get("/inspection")
	@Operation(
		summary = "Obtiene las revisiones asociadas",
		description = "Obtiene todas las revisiones"
	)
	@ApiResponse(content = @Content(mediaType = "application/json", schema = @Schema(type = "array")))
	@ApiResponse(
		responseCode = "200",
		description = "Lista de revisiones",
		content = @Content(array = @ArraySchema(schema = @Schema(implementation = Inspection)))
	)
	HttpResponse<List<Inspection>> findInspections(@QueryValue String shortCode) {
		List<Inspection> inspections = inspectionService.findAll(shortCode)
		return inspections ? HttpResponse.ok(inspections) : HttpResponse.notFound(inspections)
    }

}
