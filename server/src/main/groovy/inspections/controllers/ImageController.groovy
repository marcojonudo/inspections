package inspections.controllers

import groovy.transform.CompileStatic
import inspections.domains.Image
import inspections.services.data.ImageDataService
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.*
import io.micronaut.http.multipart.CompletedFileUpload
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse

import javax.inject.Inject

@Controller("/images")
@CompileStatic
class ImageController {

    @Inject ImageDataService imageDataService

    @Get("/{id}")
    @Operation(
        summary = "Obtiene una imagen",
        description = "Obtiene una imagen"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Imagen obtenida correctamente",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = Image)))
    )
    Image getImage(@PathVariable Long id) {
        return imageDataService.find(id)
    }

    @Get
    @Operation(
        summary = "Obtiene una lista de imágenes",
        description = "Obtiene una lista de imágenes"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Imágenes obtenidas correctamente",
        content = @Content(array = @ArraySchema(schema = @Schema(implementation = Image)))
    )
    List<Image> findImages(@QueryValue List<Long> ids) {
        return imageDataService.findAll(ids)
    }

    @Post(value = "/{orderNumber}/{itemCode}", consumes = MediaType.MULTIPART_FORM_DATA)
    @Operation(
        summary = "Guarda una imagen",
        description = "Guarda una imagen"
    )
    @ApiResponse(
        responseCode = "201",
        description = "Imagen guardada correctamente",
        content = @Content(mediaType = "multipart/form-data")
    )
    Image saveImage(
        @PathVariable int orderNumber,
        @PathVariable String itemCode,
        @QueryValue boolean landscape,
        @Body CompletedFileUpload image
    ) {
        return imageDataService.save(orderNumber, itemCode, image.bytes, landscape)
    }

}
