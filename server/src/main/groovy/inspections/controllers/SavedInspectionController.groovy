package inspections.controllers

import groovy.transform.CompileStatic
import inspections.domains.SavedInspection
import inspections.services.InspectionService
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.PathVariable
import io.micronaut.http.annotation.QueryValue
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/savedInspections")
@CompileStatic
class SavedInspectionController {

	@Inject private InspectionService inspectionService

	@Get("/{orderNumber}")
	@Operation(
		summary = "Obtiene la revision guardada previamente",
		description = "Obtiene la revisión guardad previamente, si existe"
	)
	@ApiResponse(
		responseCode = "200",
		description = "Revisión guardada",
		content = @Content(schema = @Schema(implementation = SavedInspection))
	)
	HttpResponse<SavedInspection> findSavedInspection(
		@PathVariable int orderNumber,
		@QueryValue String employeeCode,
		@QueryValue String inspectionTypeCode,
		@QueryValue String vehicle,
		@QueryValue String numberPlate,
		@QueryValue boolean orderInspection
	) {
		SavedInspection savedInspection = inspectionService.findSavedInspection(
			orderNumber, employeeCode, inspectionTypeCode, vehicle, numberPlate, orderInspection
		)
		return HttpResponse.ok(savedInspection)
	}

}
