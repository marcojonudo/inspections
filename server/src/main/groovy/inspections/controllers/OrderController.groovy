package inspections.controllers

import groovy.transform.CompileStatic
import inspections.domains.fviberi.Order
import inspections.services.InspectionService
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Header
import io.micronaut.http.annotation.PathVariable
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/orders")
@CompileStatic
class OrderController {

	@Inject private InspectionService inspectionService

	@Get("/{shortCode}")
	@Operation(
		summary = "Obtiene el número de orden a partir del código corto",
		description = "Obtiene el número de orden a partir del código corto"
	)
	@ApiResponse(
		responseCode = "200",
		description = "Número de orden encontrado",
		content = @Content(mediaType = "application/json", schema = @Schema(implementation = Order))
	)
	@ApiResponse(
		responseCode = "404", description = "Número de orden no encontrado"
	)
	Order findOrder(@Header String employeeCode, @PathVariable String shortCode) {
		return inspectionService.findOrder(shortCode, employeeCode)
	}

}
