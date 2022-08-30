package inspections.clients

import groovy.transform.CompileStatic
import inspections.pogos.budgets.Budget
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.QueryValue
import io.micronaut.http.client.annotation.Client

import javax.inject.Singleton

@Singleton
@CompileStatic
@Client("\${services.db-api.url}")
interface DbApiClient {

    @Get("/budgets")
    Budget findBudget(@QueryValue int orderNumber)

}
