package inspections.services

import inspections.clients.InspectionsManagementClient
import inspections.domains.InspectionType
import inspections.domains.InspectionVehicle
import inspections.domains.fviberi.Order
import inspections.domains.fviberi.OrderLine
import inspections.domains.items.Item
import inspections.domains.items.ItemVehicleData
import inspections.domains.items.TextItem
import inspections.domains.items.TextItemField
import inspections.domains.items.TextItemFieldValue
import inspections.domains.savedItems.TextSavedItemDataField
import inspections.services.data.InspectionVehicleDataService
import inspections.services.data.ItemDataService
import inspections.services.data.SavedInspectionDataService
import inspections.services.data.TextItemDataService
import inspections.services.data.TextItemFieldValueDataService
import inspections.services.data.fviberi.CarDataService
import inspections.services.data.fviberi.CentreDataService
import inspections.services.data.fviberi.OrderDataService
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
    @Inject CentreDataService centreDataService
    @Inject CarDataService carDataService
    @Inject SavedInspectionDataService savedInspectionDataService
    @Inject SlackService slackService
    @Inject InspectionsManagementClient inspectionsManagementClient
    @Inject ItemDataService itemDataService
    @Inject TextItemDataService textItemDataService
    @Inject TextItemFieldValueDataService textItemFieldValueDataService

    @MockBean(TextItemFieldValueDataService)
    TextItemFieldValueDataService textItemFieldValueDataService() {
        Mock(TextItemFieldValueDataService)
    }

    @MockBean(TextItemDataService)
    TextItemDataService textItemDataService() {
        Mock(TextItemDataService)
    }

    @MockBean(ItemDataService)
    ItemDataService itemDataService() {
        Mock(ItemDataService)
    }

    @MockBean(InspectionsManagementClient)
    InspectionsManagementClient inspectionsManagementClient() {
        Mock(InspectionsManagementClient)
    }

    @MockBean(SlackService)
    SlackService slackService() {
        Mock(SlackService)
    }

    @MockBean(OrderDataService)
    OrderDataService orderDataService() {
        Mock(OrderDataService)
    }

    @MockBean(InspectionVehicleDataService)
    InspectionVehicleDataService inspectionVehicleDataService() {
        Mock(InspectionVehicleDataService)
    }

    @MockBean(CentreDataService)
    CentreDataService centreDataService() {
        Mock(CentreDataService)
    }

    @MockBean(CarDataService)
    CarDataService carDataService() {
        Mock(CarDataService)
    }

    @MockBean(SavedInspectionDataService)
    SavedInspectionDataService savedInspectionDataService() {
        Mock(SavedInspectionDataService)
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
            order1.number, "", InspectionVehicle.Vehicle.CAR.toString()
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
        InspectionVehicle inspection = inspectionService.findInspection(order1.number, "", "")

        then:
        inspection.inspectionType.code == InspectionType.Code.SE.toString()
    }

    // endregion

    // region Check correct fields

    void "test check correct fields empty saved fields"() {
        given:
        List<TextSavedItemDataField> fields = []

        when:
        LocalDate day = inspectionService.findItvDate(fields)

        then:
        !day
    }

    void "test check correct fields different size saved fields"() {
        given:
        List<TextSavedItemDataField> fields = [new TextSavedItemDataField()]

        when:
        LocalDate day = inspectionService.findItvDate(fields)

        then:
        !day
    }

    void "test check correct fields save size saved fields with empty values"() {
        given:
        List<TextSavedItemDataField> fields = [new TextSavedItemDataField(), new TextSavedItemDataField()]

        when:
        LocalDate day = inspectionService.findItvDate(fields)

        then:
        !day
    }

    void "test check correct fields save size saved fields with wrong month value"() {
        given:
        List<TextSavedItemDataField> fields = [new TextSavedItemDataField(text: "0"), new TextSavedItemDataField(text: "2022")]

        when:
        LocalDate day = inspectionService.findItvDate(fields)

        then:
        !day
    }

    // endregion

    // region Update text item year value

    void "test update text item year value ITV item correct max year"() {
        given:
        LocalDate today = LocalDate.now()
        int refYear = today.plusYears(5).year
        TextItem item = new TextItem(fields: [
            new TextItemField(order: 1, values: [new TextItemFieldValue(value: "${today.plusYears(6).year}")])
        ])

        when:
        List<TextItemFieldValue> values = inspectionService.handleTextItemYearValue(item, refYear)

        then:
        !values
    }

    void "test update text item year value ITV item wrong max year"() {
        given:
        LocalDate today = LocalDate.now()
        int refYear = today.plusYears(5).year
        TextItem item = new TextItem(fields: [
            new TextItemField(order: 1, values: [new TextItemFieldValue(id: 1, value: "${today.plusYears(4).year}")])
        ])
        textItemFieldValueDataService.update(_, _) >> new TextItemFieldValue(id: 1, value: refYear as String)

        when:
        List<TextItemFieldValue> values = inspectionService.handleTextItemYearValue(item, refYear)

        then:
        values
        values.size() == 1
        values[0].value == refYear as String
    }

    // endregion

}
