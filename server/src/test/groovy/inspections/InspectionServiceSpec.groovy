package inspections

import inspections.domains.InspectionType
import inspections.domains.InspectionVehicle
import inspections.domains.items.Item
import inspections.services.InspectionService
import io.micronaut.test.annotation.MicronautTest
import spock.lang.Specification

import javax.inject.Inject

@MicronautTest
class InspectionServiceSpec extends Specification {

    @Inject InspectionService inspectionService

    private final static CAR = "CAR"

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
            new InspectionVehicle(new InspectionType(code: "A"), CAR, [new Item(name: "Item")].toSet())
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
            new InspectionVehicle(new InspectionType(code: "A"), CAR, [new Item(name: "Item 1")].toSet()),
            new InspectionVehicle(new InspectionType(code: "A"), CAR, [new Item(name: "Item 2"), new Item(name: "Item 3")].toSet()),
            new InspectionVehicle(new InspectionType(code: "A"), CAR, [new Item(name: "Item 4")].toSet())
        ]

        when:
        InspectionVehicle inspection = inspectionService.buildGroupedInspection(inspections)

        then:
        inspection.inspectionType.code == inspections[1].inspectionType.code
        inspection.items.size() == inspections.items.flatten().size()
    }

    // endregion

}
