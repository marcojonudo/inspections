package inspections.controllers

import groovy.transform.CompileStatic
import inspections.domains.Inspection
import inspections.domains.SavedInspection
import inspections.domains.schedules.EmployeeData
import inspections.pogos.InspectionInfo
import inspections.pogos.OrderInfo
import inspections.services.InspectionService
import inspections.services.data.EmployeeDataDataService
import inspections.services.data.InspectionDataService
import inspections.services.data.OrderTimeDataService
import inspections.services.data.SavedInspectionDataService
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/inspections")
@CompileStatic
class InspectionController {

	@Inject private OrderTimeDataService orderTimeDataService
	@Inject private InspectionService inspectionService
	@Inject private InspectionDataService inspectionDataService
	@Inject private SavedInspectionDataService savedInspectionDataService
	@Inject private EmployeeDataDataService employeeDataDataService

	@Get("/employees")
	@Operation(
		summary = "Obtiene los empleados",
		description = "Obtiene todos los empleados"
	)
	@ApiResponse(content = @Content(mediaType = "application/json", schema = @Schema(type = "array")))
	@ApiResponse(
		responseCode = "200",
		description = "Lista de empleados",
		content = @Content(array = @ArraySchema(schema = @Schema(implementation = EmployeeData)))
	)
    List<EmployeeData> getEmployees() {
		return employeeDataDataService.findAll()
    }

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
	OrderInfo findOrderInfo(@QueryValue String shortCode) {
		return inspectionService.findOrderInfo(shortCode)
	}

	@Get("/inspection")
	@Operation(
		summary = "Obtiene la revision asociada",
		description = "Obtiene la revisión con todos los items asociados al número de ordern"
	)
	@ApiResponse(content = @Content(mediaType = "application/json"))
	@ApiResponse(
		responseCode = "200",
		description = "Lista de revisiones",
		content = @Content(schema = @Schema(implementation = Inspection))
	)
	InspectionInfo findInspection(@QueryValue int orderNumber) {
		return inspectionService.findInspectionInfo(orderNumber)
    }

	@Post("/inspection")
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
	HttpResponse saveInspection(@Body SavedInspection inspection, @QueryValue int orderNumber) {
		SavedInspection savedInspection = inspectionService.saveInspection(inspection, orderNumber)
		return savedInspection ? HttpResponse.created(savedInspection) : HttpResponse.serverError()
    }

}
