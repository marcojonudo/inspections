package inspections.controllers

import groovy.transform.CompileStatic
import inspections.domains.InspectionVehicle
import inspections.services.InspectionService
import io.micronaut.http.annotation.*
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/inspections")
@CompileStatic
class InspectionController {

	@Inject private InspectionService inspectionService

	@Get("/{orderNumber}")
	@Operation(
		summary = "Obtiene la revision asociada",
		description = "Obtiene la revisión con todos los items asociados al número de ordern"
	)
	@ApiResponse(content = @Content(mediaType = "application/json"))
	@ApiResponse(
		responseCode = "200",
		description = "Lista de revisiones",
		content = @Content(schema = @Schema(implementation = InspectionVehicle))
	)
	InspectionVehicle findInspection(
		@Header String employeeCode, @PathVariable int orderNumber, @QueryValue String vehicle
	) {
		return inspectionService.findInspection(orderNumber, employeeCode, vehicle)
    }

}
