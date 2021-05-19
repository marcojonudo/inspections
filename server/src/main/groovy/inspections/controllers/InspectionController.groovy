package inspections.controllers

import groovy.transform.CompileStatic
import inspections.domains.Inspection
import inspections.domains.fviberi.Order
import inspections.services.InspectionService
import inspections.services.data.InspectionDataService
import inspections.services.data.OrderTimeDataService
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

	@Inject private OrderTimeDataService orderTimeDataService
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

	@Get("/order")
	@Operation(
		summary = "Obtiene el número de orden a partir del código corto",
		description = "Obtiene el número de orden a partir del código corto"
	)
	@ApiResponse(content = @Content(mediaType = "text/plain", schema = @Schema(type = "integer")))
	@ApiResponse(
		responseCode = "200",
		description = "Número de orden encontrado",
		content = @Content(mediaType = "text/plain", schema = @Schema(type = "integer"))
	)
	@ApiResponse(
		responseCode = "404", description = "Número de orden no encontrado"
	)
	Order findInspections(@QueryValue String shortCode) {
		return inspectionService.findOrder(shortCode)
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
	List<Inspection> findInspections(@QueryValue int orderNumber) {
		return inspectionService.findAll(orderNumber) ?: null
    }

}
