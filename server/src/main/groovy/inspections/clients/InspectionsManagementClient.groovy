package inspections.clients

import groovy.transform.CompileStatic
import inspections.domains.SavedInspection
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Patch
import io.micronaut.http.client.annotation.Client
import io.reactivex.Single

import javax.inject.Singleton

@Singleton
@CompileStatic
@Client("\${services.inspections-management.url}")
interface InspectionsManagementClient {

    @Patch("/inspection")
    Single<Void> notifySavedInspection(@Body SavedInspection savedInspection)

}
