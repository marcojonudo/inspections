package inspections.controllers

import groovy.transform.CompileStatic
import inspections.domains.SaveError
import inspections.services.SlackService
import inspections.services.data.SaveErrorDataService
import inspections.utils.Builder
import io.micronaut.http.HttpResponse
import io.micronaut.http.HttpStatus
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Header
import io.micronaut.http.annotation.Post
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/saveErrors")
@CompileStatic
class SaveErrorController {

    @Inject SaveErrorDataService inspectionSaveErrorDataService
    @Inject SlackService slackService

    @Post
    @Operation(
        summary = "Guarda un registro de error",
        description = "Guarda un registro de error"
    )
    @ApiResponse(
        responseCode = "201",
        description = "Registro creado correctamente",
        content = @Content(schema = @Schema(implementation = SaveError))
    )
    HttpResponse saveError(@Header int centre, @Body SaveError error) {
        /* Si el statusCode es 500, ya se habrá enviado la notificación en el procesamiento de la revisión. Si, por
         * ejemplo, es un error de validación (400), se enviará notificación */
        if (error.statusCode != HttpStatus.INTERNAL_SERVER_ERROR.code) {
            slackService.sendMessage(Builder.Slack.buildSaveErrorMessage(error, centre))
        }
        return HttpResponse.created(inspectionSaveErrorDataService.save(error))
    }

}
