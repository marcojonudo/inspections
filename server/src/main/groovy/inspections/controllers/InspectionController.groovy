package inspections.controllers

import groovy.transform.CompileStatic
import inspections.domains.InspectionVehicle
import inspections.domains.SavedInspection
import inspections.services.InspectionService
import io.micronaut.http.HttpResponse
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

	@Post
	@Operation(
		summary = "Guarda una revisión",
		description = "Guarda una revisión con los items asociados"
	)
	@ApiResponse(content = @Content(mediaType = "application/json"))
	@ApiResponse(
		responseCode = "201",
		description = "Revisión creada",
		content = @Content(schema = @Schema(implementation = SavedInspection))
	)
	HttpResponse saveInspection(@Header int centre, @Body SavedInspection inspection) {
		// TODO Añadir employee code
		SavedInspection savedInspection = inspectionService.saveInspection(
			inspection, inspection.orderNumber, inspection.employeeCode, centre
		)
		return savedInspection ? HttpResponse.created(savedInspection.id) : HttpResponse.serverError()
    }

}
