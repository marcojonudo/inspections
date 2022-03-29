package inspections.services

import inspections.domains.InspectionType
import inspections.domains.InspectionVehicle
import inspections.domains.fviberi.Order
import inspections.domains.fviberi.OrderLine
import inspections.domains.items.Item
import inspections.domains.items.ItemVehicleData
import inspections.domains.items.TextItem
import inspections.domains.items.TextItemField
import inspections.domains.savedItems.TextSavedItemField
import inspections.services.data.InspectionVehicleDataService
import inspections.services.data.OrderDataService
import io.micronaut.test.annotation.MicronautTest
import io.micronaut.test.annotation.MockBean
import spock.lang.Shared
import spock.lang.Specification

import javax.inject.Inject
import java.time.LocalDate

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
        Set<Item> items = [
            new Item(
                name: "Item", vehicleDataList: [new ItemVehicleData(vehicle: InspectionVehicle.Vehicle.CAR.toString())]
            )
        ].toSet()
        List<InspectionVehicle> inspections = [
            new InspectionVehicle(new InspectionType(code: "A"), InspectionVehicle.Vehicle.CAR.toString(), items)
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
        Set<ItemVehicleData> vehicleDataList = [new ItemVehicleData(vehicle: InspectionVehicle.Vehicle.CAR.toString())]
        List<InspectionVehicle> inspections = [
            new InspectionVehicle(
                new InspectionType(code: "A"),
                InspectionVehicle.Vehicle.CAR.toString(),
                [new Item(code: "I1", name: "Item 1", vehicleDataList: vehicleDataList)].toSet()
            ),
            new InspectionVehicle(
                new InspectionType(code: "A"),
                InspectionVehicle.Vehicle.CAR.toString(),
                [
                    new Item(code: "I2", name: "Item 2", vehicleDataList: vehicleDataList),
                    new Item(code: "I3", name: "Item 3", vehicleDataList: vehicleDataList)
                ].toSet()
            ),
            new InspectionVehicle(
                new InspectionType(code: "A"),
                InspectionVehicle.Vehicle.CAR.toString(),
                [new Item(code: "I4", name: "Item 4", vehicleDataList: vehicleDataList)].toSet()
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
        InspectionVehicle inspection = inspectionService.findInspection(
            order1.number, "", InspectionVehicle.Vehicle.CAR.toString(), ""
        )

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
        InspectionVehicle inspection = inspectionService.findInspection(order1.number, "", "", "")

        then:
        inspection.inspectionType.code == InspectionType.Code.SE.toString()
    }

    // endregion

    // region Check correct fields

    void "test check correct fields empty saved fields"() {
        given:
        TextItem item = new TextItem(fields: [new TextItemField(), new TextItemField()])
        List<TextSavedItemField> fields = []

        when:
        LocalDate day = inspectionService.findItvDate(item, fields)

        then:
        !day
    }

    void "test check correct fields different size saved fields"() {
        given:
        TextItem item = new TextItem(fields: [new TextItemField(), new TextItemField()])
        List<TextSavedItemField> fields = [new TextSavedItemField()]

        when:
        LocalDate day = inspectionService.findItvDate(item, fields)

        then:
        !day
    }

    void "test check correct fields save size saved fields with empty values"() {
        given:
        TextItem item = new TextItem(fields: [new TextItemField(), new TextItemField()])
        List<TextSavedItemField> fields = [new TextSavedItemField(), new TextSavedItemField()]

        when:
        LocalDate day = inspectionService.findItvDate(item, fields)

        then:
        !day
    }

    void "test check correct fields save size saved fields with wrong month value"() {
        given:
        TextItem item = new TextItem(fields: [new TextItemField(), new TextItemField()])
        List<TextSavedItemField> fields = [new TextSavedItemField(text: "0"), new TextSavedItemField(text: "2022")]

        when:
        LocalDate day = inspectionService.findItvDate(item, fields)

        then:
        !day
    }

    // endregion

}
