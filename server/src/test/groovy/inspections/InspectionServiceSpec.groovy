package inspections

import inspections.domains.InspectionType
import inspections.domains.InspectionVehicle
import inspections.domains.fviberi.Order
import inspections.domains.fviberi.OrderLine
import inspections.domains.items.Item
import inspections.services.InspectionService
import inspections.services.data.InspectionVehicleDataService
import inspections.services.data.OrderDataService
import io.micronaut.test.annotation.MicronautTest
import io.micronaut.test.annotation.MockBean
import spock.lang.Shared
import spock.lang.Specification

import javax.inject.Inject

@MicronautTest
class InspectionServiceSpec extends Specification {

    @Inject InspectionService inspectionService
    @Inject OrderDataService orderDataService
    @Inject InspectionVehicleDataService inspectionVehicleDataService

    @MockBean(OrderDataService)
    OrderDataService orderDataService() {
        Mock(OrderDataService)
    }

    @MockBean(InspectionVehicleDataService)
    InspectionVehicleDataService inspectionVehicleDataService() {
        Mock(InspectionVehicleDataService)
    }

    @Shared Order order1

    void setupSpec() {
        order1 = new Order(number: 1)
        order1.lines = [new OrderLine(order: order1, articleCode: 1)]
    }

    // region Build grouped inspection

    void "test build grouped inspection empty inspections"() {
        given:
        List<InspectionVehicle> inspections = []

        when:
        InspectionVehicle inspection = inspectionService.buildGroupedInspection(inspections)

        then:
        !inspection
    }

    void "test build grouped inspection one inspection"() {
        given:
        List<InspectionVehicle> inspections = [
            new InspectionVehicle(
                new InspectionType(code: "A"),
                InspectionVehicle.Vehicle.CAR.toString(),
                [new Item(name: "Item")].toSet()
            )
        ]

        when:
        InspectionVehicle inspection = inspectionService.buildGroupedInspection(inspections)

        then:
        inspection.inspectionType.code == inspections[0].inspectionType.code
        inspection.items.size() == inspections[0].items.size()
        inspection.items[0].name == inspections[0].items[0].name
    }

    void "test build grouped inspection several inspections"() {
        given:
        List<InspectionVehicle> inspections = [
            new InspectionVehicle(
                new InspectionType(code: "A"),
                InspectionVehicle.Vehicle.CAR.toString(),
                [new Item(name: "Item 1")].toSet()
            ),
            new InspectionVehicle(
                new InspectionType(code: "A"),
                InspectionVehicle.Vehicle.CAR.toString(),
                [new Item(name: "Item 2"), new Item(name: "Item 3")].toSet()
            ),
            new InspectionVehicle(
                new InspectionType(code: "A"),
                InspectionVehicle.Vehicle.CAR.toString(),
                [new Item(name: "Item 4")].toSet()
            )
        ]

        when:
        InspectionVehicle inspection = inspectionService.buildGroupedInspection(inspections)

        then:
        inspection.inspectionType.code == inspections[1].inspectionType.code
        inspection.items.size() == inspections.items.flatten().size()
    }

    // endregion

    // region Find inspection

    void "test find inspection existent inspection for article codes"() {
        given:
        orderDataService.find(order1.number) >> order1
        inspectionVehicleDataService.findAll(order1.lines.articleCode.toList()) >> [
            new InspectionVehicle(
                inspectionType: new InspectionType(code: InspectionType.Code.SE),
                vehicle: InspectionVehicle.Vehicle.CAR.toString(),
                items: []
            )
        ]

        when:
        InspectionVehicle inspection = inspectionService.findInspection(order1.number)

        then:
        inspection.inspectionType.code == InspectionType.Code.SE.toString()
    }

    void "test find inspection non existent inspection for article codes"() {
        given:
        orderDataService.find(order1.number) >> order1
        inspectionVehicleDataService.findAll(order1.lines.articleCode.toList()) >> []
        inspectionVehicleDataService.find(InspectionType.Code.SE.toString(), InspectionVehicle.Vehicle.CAR.toString()) >>
            new InspectionVehicle(
                inspectionType: new InspectionType(code: InspectionType.Code.SE),
                vehicle: InspectionVehicle.Vehicle.CAR.toString(),
                items: []
            )

        when:
        InspectionVehicle inspection = inspectionService.findInspection(order1.number)

        then:
        inspection.inspectionType.code == InspectionType.Code.SE.toString()
    }

    // endregion

}
