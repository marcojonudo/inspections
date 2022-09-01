package inspections.services

import inspections.clients.DbApiClient
import inspections.clients.InspectionsManagementClient
import inspections.clients.OrdersManagementClient
import inspections.domains.InspectionType
import inspections.domains.InspectionVehicle
import inspections.domains.SavedInspection
import inspections.domains.SavedInspectionData
import inspections.domains.fviberi.Order
import inspections.domains.fviberi.OrderLine
import inspections.domains.items.*
import inspections.domains.savedItems.SavedItem
import inspections.domains.savedItems.SelectSavedItemData
import inspections.domains.savedItems.TextSavedItemData
import inspections.domains.savedItems.TextSavedItemDataField
import inspections.pogos.budgets.*
import inspections.services.data.*
import inspections.services.data.fviberi.CarDataService
import inspections.services.data.fviberi.CentreDataService
import inspections.services.data.fviberi.OrderDataService
import inspections.utils.Constants
import io.micronaut.http.HttpResponse
import io.micronaut.http.client.exceptions.HttpClientResponseException
import io.micronaut.test.annotation.MicronautTest
import io.micronaut.test.annotation.MockBean
import spock.lang.Shared
import spock.lang.Specification

import javax.inject.Inject
import java.time.LocalDate
import java.time.LocalDateTime

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
    @Inject OrdersManagementClient ordersManagementClient
    @Inject DbApiClient dbApiClient

    @MockBean(DbApiClient)
    DbApiClient dbApiClient() {
        Mock(DbApiClient)
    }

    @MockBean(OrdersManagementClient)
    OrdersManagementClient ordersManagementClient() {
        Mock(OrdersManagementClient)
    }

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

    void "test update text item year value tyre age item correct max year"() {
        given:
        LocalDate today = LocalDate.now()
        int refYear = today.year
        TextItem item = new TextItem(fields: [
            new TextItemField(order: 1, values: [new TextItemFieldValue(value: "${today.year}"[2..-1])])
        ])

        when:
        List<TextItemFieldValue> values = inspectionService.handleTextItemYearValue(item, "$refYear"[2..-1] as int)

        then:
        !values
    }

    void "test update text item year value tyre age item wrong max year"() {
        given:
        LocalDate today = LocalDate.now()
        int refYear = today.plusYears(1).year
        TextItem item = new TextItem(fields: [
            new TextItemField(order: 1, values: [new TextItemFieldValue(id: 1, value: "${today.year}"[2..-1])])
        ])
        textItemFieldValueDataService.update(_, _) >> new TextItemFieldValue(id: 1, value: "$refYear"[2..-1])

        when:
        List<TextItemFieldValue> values = inspectionService.handleTextItemYearValue(item, "$refYear"[2..-1] as int)

        then:
        values
        values.size() == 1
        values[0].value == "$refYear"[2..-1]
    }

    // endregion

    // region Find tyre wrong items

    void "test find tyre wrong items no tyre items"() {
        given:
        Set<SavedItem> savedItems = [new SavedItem(code: "A"), new SavedItem(code: "B"), new SavedItem(code: "C")]

        when:
        Set<SavedItem> wrongItems = inspectionService.findTyreWrongItems(savedItems)

        then:
        !wrongItems
    }

    void "test find tyre wrong items no wrong items"() {
        given:
        Set<SavedItem> savedItems = [
            new SavedItem(code: Constants.Item.ENDI, data: [new SelectSavedItemData(value: Constants.CORRECT_SELECT_OPTION)]),
            new SavedItem(code: Constants.Item.ENDD, data: [new SelectSavedItemData(value: Constants.CORRECT_SELECT_OPTION)]),
            new SavedItem(code: Constants.Item.ENTI, data: [new SelectSavedItemData(value: Constants.CORRECT_SELECT_OPTION)]),
            new SavedItem(code: Constants.Item.ENTD, data: [new SelectSavedItemData(value: Constants.CORRECT_SELECT_OPTION)])
        ]

        when:
        Set<SavedItem> wrongItems = inspectionService.findTyreWrongItems(savedItems)

        then:
        !wrongItems
    }

    void "test find tyre wrong items pending items"() {
        given:
        Set<SavedItem> savedItems = [
            new SavedItem(code: Constants.Item.ENDI, data: [new SelectSavedItemData(value: Constants.PENDING_SELECT_OPTION)]),
            new SavedItem(code: Constants.Item.ENDD, data: [new SelectSavedItemData(value: Constants.PENDING_SELECT_OPTION)]),
            new SavedItem(code: Constants.Item.ENTI, data: [new SelectSavedItemData(value: Constants.PENDING_SELECT_OPTION)]),
            new SavedItem(code: Constants.Item.ENTD, data: [new SelectSavedItemData(value: Constants.PENDING_SELECT_OPTION)])
        ]

        when:
        Set<SavedItem> wrongItems = inspectionService.findTyreWrongItems(savedItems)

        then:
        !wrongItems
    }

    void "test find tyre wrong items wrong items"() {
        given:
        Set<SavedItem> savedItems = [
            new SavedItem(code: Constants.Item.ENDI, data: [new SelectSavedItemData(value: "SN")]),
            new SavedItem(code: Constants.Item.ENDD, data: [new SelectSavedItemData(value: Constants.CORRECT_SELECT_OPTION)]),
            new SavedItem(code: Constants.Item.ENTI, data: [new SelectSavedItemData(value: "SN")]),
            new SavedItem(code: Constants.Item.ENTD, data: [new SelectSavedItemData(value: Constants.CORRECT_SELECT_OPTION)]),
        ]

        when:
        Set<SavedItem> wrongItems = inspectionService.findTyreWrongItems(savedItems)

        then:
        wrongItems
        wrongItems.size() == 2
    }

    // endregion

    // region Find tyre measurement fields

    void "test find tyre measurement fields incomplete fields"() {
        given:
        SavedItem savedItem = new SavedItem(
            data: [new TextSavedItemData(fields: [new TextSavedItemDataField()])]
        )

        when:
        TyreMeasurementData data = inspectionService.findTyreMeasurementData(savedItem)

        then:
        !data
    }

    void "test find tyre measurement fields all fields without value"() {
        given:
        SavedItem savedItem = new SavedItem(
            data: [new TextSavedItemData(fields: [
                new TextSavedItemDataField(text: "A"),
                new TextSavedItemDataField(text: "A"),
                new TextSavedItemDataField(text: "A"),
                new TextSavedItemDataField(text: "A"),
                new TextSavedItemDataField(text: null)
            ])]
        )

        when:
        TyreMeasurementData data = inspectionService.findTyreMeasurementData(savedItem)

        then:
        !data
    }

    void "test find tyre measurement fields all fields with value"() {
        given:
        SavedItem savedItem = new SavedItem(
            data: [new TextSavedItemData(fields: [
                new TextSavedItemDataField(text: "A", order: 0),
                new TextSavedItemDataField(text: "A", order: 1),
                new TextSavedItemDataField(text: "A", order: 2),
                new TextSavedItemDataField(text: "A", order: 3),
                new TextSavedItemDataField(text: "A", order: 4)
            ])]
        )

        when:
        TyreMeasurementData data = inspectionService.findTyreMeasurementData(savedItem)

        then:
        data
    }

    // endregion

    // region Find tyre units

    void "test find tyre units no units"() {
        given:
        Set<SavedItem> tyreSavedItems = []

        when:
        float units = inspectionService.findTyreUnits(tyreSavedItems)

        then:
        units == 0
    }

    void "test find tyre units one front wrong item"() {
        given:
        Set<SavedItem> tyreSavedItems = [new SavedItem(code: Constants.Item.ENDI)]

        when:
        float units = inspectionService.findTyreUnits(tyreSavedItems)

        then:
        units == 2
    }

    void "test find tyre units two front wrong item"() {
        given:
        Set<SavedItem> tyreSavedItems = [
            new SavedItem(code: Constants.Item.ENDI), new SavedItem(code: Constants.Item.ENDD)
        ]

        when:
        float units = inspectionService.findTyreUnits(tyreSavedItems)

        then:
        units == 2
    }

    void "test find tyre units one back wrong item"() {
        given:
        Set<SavedItem> tyreSavedItems = [new SavedItem(code: Constants.Item.ENTD)]

        when:
        float units = inspectionService.findTyreUnits(tyreSavedItems)

        then:
        units == 2
    }

    void "test find tyre units three wrong items"() {
        given:
        Set<SavedItem> tyreSavedItems = [
            new SavedItem(code: Constants.Item.ENDI),
            new SavedItem(code: Constants.Item.ENDD),
            new SavedItem(code: Constants.Item.ENTI)
        ]

        when:
        float units = inspectionService.findTyreUnits(tyreSavedItems)

        then:
        units == 4
    }

    void "test find tyre units all tyre wrong items"() {
        given:
        Set<SavedItem> tyreSavedItems = [
            new SavedItem(code: Constants.Item.ENDI),
            new SavedItem(code: Constants.Item.ENDD),
            new SavedItem(code: Constants.Item.ENTI),
            new SavedItem(code: Constants.Item.ENTD)
        ]

        when:
        float units = inspectionService.findTyreUnits(tyreSavedItems)

        then:
        units == 4
    }

    // endregion

    // region Handle budget creation

    void "test find budget fields articles not complete fields"() {
        given:
        SavedInspection savedInspection = new SavedInspection(
            data: [new SavedInspectionData(employeeCode: "1")],
            items: [
                new SavedItem(code: Constants.Item.ENDI, data: [new SelectSavedItemData(value: "SN")]),
                new SavedItem(code: Constants.Item.ENDD, data: [new SelectSavedItemData(value: Constants.CORRECT_SELECT_OPTION)]),
                new SavedItem(code: Constants.Item.ENTI, data: [new SelectSavedItemData(value: Constants.CORRECT_SELECT_OPTION)]),
                new SavedItem(code: Constants.Item.ENTD, data: [new SelectSavedItemData(value: Constants.CORRECT_SELECT_OPTION)]),
                new SavedItem(code: Constants.Item.PN, data: [
                    new TextSavedItemData(fields: [
                        new TextSavedItemDataField(text: "A")
                    ])
                ])
            ]
        )

        when:
        BudgetData fields = inspectionService.findBudgetFields(savedInspection)

        then:
        !fields
    }

    void "test find budget fields articles no wrong items"() {
        given:
        SavedInspection savedInspection = new SavedInspection(
            data: [new SavedInspectionData(employeeCode: "1")],
            items: [
                new SavedItem(code: Constants.Item.ENDI, data: [new SelectSavedItemData(value: Constants.CORRECT_SELECT_OPTION)]),
                new SavedItem(code: Constants.Item.ENDD, data: [new SelectSavedItemData(value: Constants.CORRECT_SELECT_OPTION)]),
                new SavedItem(code: Constants.Item.ENTI, data: [new SelectSavedItemData(value: Constants.CORRECT_SELECT_OPTION)]),
                new SavedItem(code: Constants.Item.ENTD, data: [new SelectSavedItemData(value: Constants.CORRECT_SELECT_OPTION)]),
                new SavedItem(code: Constants.Item.PN, data: [
                    new TextSavedItemData(fields: [
                        new TextSavedItemDataField(text: "A")
                    ])
                ])
            ]
        )

        when:
        BudgetData fields = inspectionService.findBudgetFields(savedInspection)

        then:
        !fields
    }

    void "test find budget fields articles all data"() {
        given:
        SavedInspection savedInspection = new SavedInspection(
            data: [new SavedInspectionData(employeeCode: "1")],
            items: [
                new SavedItem(code: Constants.Item.ENDI, data: [new SelectSavedItemData(value: "SN")]),
                new SavedItem(code: Constants.Item.ENDD, data: [new SelectSavedItemData(value: Constants.CORRECT_SELECT_OPTION)]),
                new SavedItem(code: Constants.Item.ENTI, data: [new SelectSavedItemData(value: Constants.CORRECT_SELECT_OPTION)]),
                new SavedItem(code: Constants.Item.ENTD, data: [new SelectSavedItemData(value: Constants.CORRECT_SELECT_OPTION)]),
                new SavedItem(code: Constants.Item.PN, data: [
                    new TextSavedItemData(fields: [
                        new TextSavedItemDataField(text: "A", order: 0),
                        new TextSavedItemDataField(text: "B", order: 1),
                        new TextSavedItemDataField(text: "C", order: 2),
                        new TextSavedItemDataField(text: "D", order: 3),
                        new TextSavedItemDataField(text: "E", order: 4)
                    ])
                ])
            ]
        )

        when:
        BudgetData fields = inspectionService.findBudgetFields(savedInspection)

        then:
        fields
    }

    // endregion

    // region Find budget article

    void "test find budget article wrong request"() {
        given:
        TyreMeasurementData tyreData = new TyreMeasurementData("A", "B", "C", "D", "E")
        ordersManagementClient.findTyreBudget("A", "B", "C", "D", "E", 1) >> {
            throw new HttpClientResponseException("error", HttpResponse.serverError())
        }

        when:
        Integer budgetArticle = inspectionService.findBudgetArticle(tyreData, 1, 1)

        then:
        !budgetArticle
}

    void "test find budget article successful request"() {
        given:
        TyreMeasurementData tyreData = new TyreMeasurementData("A", "B", "C", "D", "E")
        ordersManagementClient.findTyreBudget("A", "B", "C", "D", "E", 1) >> HttpResponse.ok(1)

        when:
        Integer budgetArticle = inspectionService.findBudgetArticle(tyreData, 1, 1)

        then:
        budgetArticle
        budgetArticle == 1
    }

    // endregion

    // region Check create budget

    void "test check create budget error requesting budget"() {
        given:
        int orderNumber = 1
        dbApiClient.findBudgets(orderNumber) >> { throw new Exception("Error!") }

        when:
        boolean create = inspectionService.checkCreateBudget(orderNumber, 1)

        then:
        !create
    }

    void "test check create budget not found budget"() {
        given:
        int orderNumber = 1
        dbApiClient.findBudgets(orderNumber) >> { throw new HttpClientResponseException("", HttpResponse.notFound()) }

        when:
        boolean create = inspectionService.checkCreateBudget(orderNumber, 1)

        then:
        !create
    }

    void "test check create budget found budget already created budget"() {
        given:
        int orderNumber = 1
        Integer articleCode = 1
        dbApiClient.findBudgets(orderNumber) >> [
            new Budget(1, LocalDateTime.now(), [
                new BudgetLine(article: new Article(code: 3)), new BudgetLine(article: new Article(code: 4))
            ]),
            new Budget(2, LocalDateTime.now(), [
                new BudgetLine(article: new Article(code: 1)), new BudgetLine(article: new Article(code: 4))
            ]),
            new Budget(3, LocalDateTime.now(), [
                new BudgetLine(article: new Article(code: 4)), new BudgetLine(article: new Article(code: 4))
            ])
        ]

        when:
        boolean create = inspectionService.checkCreateBudget(orderNumber, articleCode)

        then:
        !create
    }

    void "test check create budget found budget with different article codes"() {
        given:
        int orderNumber = 1
        Integer articleCode = 1
        dbApiClient.findBudgets(orderNumber) >> [
            new Budget(1, LocalDateTime.now(), [
                new BudgetLine(article: new Article(code: 3)), new BudgetLine(article: new Article(code: 4))
            ]),
            new Budget(2, LocalDateTime.now(), [
                new BudgetLine(article: new Article(code: 4)), new BudgetLine(article: new Article(code: 4))
            ]),
            new Budget(3, LocalDateTime.now(), [
                new BudgetLine(article: new Article(code: 5)), new BudgetLine(article: new Article(code: 4))
            ])
        ]

        when:
        boolean create = inspectionService.checkCreateBudget(orderNumber, articleCode)

        then:
        create
    }

    // endregion

    // region Find inspection duration

    void "test find inspection duration no updated field"() {
        given:
        Set<SavedInspectionData> data = [
            new SavedInspectionData(reason: SavedInspectionData.Reason.SAVED, saved: LocalDateTime.now().minusMinutes(60))
        ]

        when:
        Optional<Integer> durationOpt = InspectionService.findInspectionDuration(data)

        then:
        !durationOpt.isPresent()
    }

    void "test find inspection duration success"() {
        given:
        int secondsDiff = 3600
        Set<SavedInspectionData> data = [
            new SavedInspectionData(reason: SavedInspectionData.Reason.SAVED, saved: LocalDateTime.now().minusSeconds(secondsDiff)),
            new SavedInspectionData(reason: SavedInspectionData.Reason.UPDATED, saved: LocalDateTime.now().minusMinutes(30)),
            new SavedInspectionData(reason: SavedInspectionData.Reason.UPDATED, saved: LocalDateTime.now())
        ]

        when:
        Optional<Integer> durationOpt = InspectionService.findInspectionDuration(data)

        then:
        durationOpt.isPresent()
        durationOpt.get() == secondsDiff
    }

    // endregion

}
