package inspections.controllers

import groovy.transform.CompileStatic
import inspections.domains.InspectionVehicle
import inspections.domains.SavedInspection
import inspections.domains.schedules.EmployeeData
import inspections.pogos.OrderInfo
import inspections.services.InspectionService
import inspections.services.data.*
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
	@Inject private SavedInspectionDataService savedInspectionDataService
	@Inject private EmployeeDataDataService employeeDataDataService
	@Inject private LanguageDataService languageDataService
	@Inject private ItemDataService itemDataService
	@Inject private SavedItemDataService savedItemDataService

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

	@Get("/language")
	@Operation(
		summary = "Obtiene el idioma de la aplicación",
		description = "Obtiene el código de idioma de la base de datos"
	)
	@ApiResponse(
		responseCode = "200",
		description = "Idioma encontrado",
		content = @Content(mediaType = "text/plain", schema = @Schema(type = "string"))
	)
	String findLanguage() {
		return languageDataService.findLanguageLang()
	}

	@Get("/order")
	@Operation(
		summary = "Obtiene el número de orden a partir del código corto",
		description = "Obtiene el número de orden a partir del código corto"
	)
	@ApiResponse(
		responseCode = "200",
		description = "Número de orden encontrado",
		content = @Content(mediaType = "application/json", schema = @Schema(implementation = OrderInfo))
	)
	@ApiResponse(
		responseCode = "404", description = "Número de orden no encontrado"
	)
	OrderInfo findOrderInfo(@QueryValue String shortCode) {
		return inspectionService.findOrderInfo(shortCode)
	}

	@Get("/savedInspection")
	@Operation(
		summary = "Obtiene la revision guardada previamente",
		description = "Obtiene la revisión guardad previamente, si existe"
	)
	@ApiResponse(
		responseCode = "200",
		description = "Revisión guardada",
		content = @Content(schema = @Schema(implementation = SavedInspection))
	)
	SavedInspection findSavedInspection(@QueryValue int orderNumber) {
		return savedInspectionDataService.find(orderNumber)
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
		content = @Content(schema = @Schema(implementation = InspectionVehicle))
	)
	InspectionVehicle findInspection(@QueryValue int orderNumber) {
		return inspectionService.findInspection(orderNumber)
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
	HttpResponse saveInspection(@Body SavedInspection inspection) {
		SavedInspection savedInspection = inspectionService.saveInspection(
			inspection, inspection.orderNumber, inspection.employeeCode
		)
		return savedInspection ? HttpResponse.created(savedInspection) : HttpResponse.serverError()
    }

}
