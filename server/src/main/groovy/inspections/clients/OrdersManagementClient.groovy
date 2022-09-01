package inspections.clients

import groovy.transform.CompileStatic
import inspections.pogos.budgets.Article
import inspections.pogos.budgets.Budget
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Post
import io.micronaut.http.annotation.QueryValue
import io.micronaut.http.client.annotation.Client

import javax.inject.Singleton

@Singleton
@CompileStatic
@Client("\${services.orders-management.url}")
interface OrdersManagementClient {

    @Get("/budgets/tyres")
    HttpResponse<Integer> findTyreBudget(
        @QueryValue String measurement,
        @QueryValue String serialNumber,
        @QueryValue String tyre,
        @QueryValue String load,
        @QueryValue String speed,
        @QueryValue float units
    )

    @Post("/budgets")
    HttpResponse<Budget> createBudget(@Body Article article, @QueryValue int orderNumber)

}
