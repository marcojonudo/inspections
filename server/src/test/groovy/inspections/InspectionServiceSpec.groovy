package inspections

import inspections.domains.Inspection
import inspections.domains.items.Item
import inspections.services.InspectionService
import io.micronaut.test.annotation.MicronautTest
import spock.lang.Specification

import javax.inject.Inject

@MicronautTest
class InspectionServiceSpec extends Specification {

    @Inject InspectionService inspectionService

    // region Build grouped inspection

    void "test build grouped inspection empty inspections"() {
        given:
        List<Inspection> inspections = []

        when:
        Inspection inspection = inspectionService.buildGroupedInspection(inspections)

        then:
        !inspection
    }

    void "test build grouped inspection one inspection"() {
        given:
        List<Inspection> inspections = [new Inspection(name: "Name", items: [new Item(name: "Item")])]

        when:
        Inspection inspection = inspectionService.buildGroupedInspection(inspections)

        then:
        inspection.name == inspections[0].name
        inspection.items.size() == inspections[0].items.size()
        inspection.items[0].name == inspections[0].items[0].name
    }

    void "test build grouped inspection several inspections"() {
        given:
        List<Inspection> inspections = [
            new Inspection(name: "Name 1", items: [new Item(name: "Item 1")]),
            new Inspection(name: "Name 2", items: [new Item(name: "Item 2"), new Item(name: "Item 3")]),
            new Inspection(name: "Name 3", items: [new Item(name: "Item 4")])
        ]

        when:
        Inspection inspection = inspectionService.buildGroupedInspection(inspections)

        then:
        inspection.name == inspections[1].name
        inspection.items.size() == inspections.items.flatten().size()
    }

    // endregion

}
