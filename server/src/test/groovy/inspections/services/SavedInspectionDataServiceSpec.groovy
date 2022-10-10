package inspections.services


import inspections.domains.savedItems.SavedItemData
import inspections.domains.savedItems.SelectSavedItemData
import inspections.services.data.ImageDataService
import inspections.services.data.ItemDataService
import inspections.services.data.SavedInspectionDataService
import io.micronaut.test.annotation.MicronautTest
import io.micronaut.test.annotation.MockBean
import spock.lang.Specification

import javax.inject.Inject
import java.time.LocalDateTime

@MicronautTest
class SavedInspectionDataServiceSpec extends Specification {

    @Inject SavedInspectionDataService savedInspectionDataService

    @Inject ItemDataService itemDataService
    @Inject ImageDataService imageDataService

    @MockBean(ImageDataService)
    ImageDataService imageDataService() {
        Mock(ImageDataService)
    }

    @MockBean(ItemDataService)
    ItemDataService itemDataService() {
        Mock(ItemDataService)
    }

    // region Check new item data

    void "test check new item data same length same items"() {
        given:
        LocalDateTime now = LocalDateTime.now()
        Set<SavedItemData> data = [new SelectSavedItemData(saved: now)]
        Set<SavedItemData> existentData = [new SelectSavedItemData(saved: now)]

        when:
        boolean newItemData = savedInspectionDataService.checkNewItemData(data, existentData)

        then:
        !newItemData
    }

    void "test check new item data same length more recent data"() {
        given:
        LocalDateTime now = LocalDateTime.now()
        Set<SavedItemData> data = [new SelectSavedItemData(saved: now.plusMinutes(1))]
        Set<SavedItemData> existentData = [new SelectSavedItemData(saved: now)]

        when:
        boolean newItemData = savedInspectionDataService.checkNewItemData(data, existentData)

        then:
        newItemData
    }

    void "test check new item data same length existent more recent saved"() {
        given:
        LocalDateTime now = LocalDateTime.now()
        Set<SavedItemData> data = [new SelectSavedItemData(saved: now)]
        Set<SavedItemData> existentData = [new SelectSavedItemData(saved: now.plusMinutes(1))]

        when:
        boolean newItemData = savedInspectionDataService.checkNewItemData(data, existentData)

        then:
        !newItemData
    }

    void "test check new item data different length same items"() {
        given:
        LocalDateTime now = LocalDateTime.now()
        Set<SavedItemData> data = [new SelectSavedItemData(saved: now), new SelectSavedItemData(saved: now)]
        Set<SavedItemData> existentData = [new SelectSavedItemData(saved: now)]

        when:
        boolean newItemData = savedInspectionDataService.checkNewItemData(data, existentData)

        then:
        !newItemData
    }

    void "test check new item data different length new saved data"() {
        given:
        LocalDateTime now = LocalDateTime.now()
        Set<SavedItemData> data = [
            new SelectSavedItemData(saved: now), new SelectSavedItemData(saved: now.plusMinutes(1))
        ]
        Set<SavedItemData> existentData = [new SelectSavedItemData(saved: now)]

        when:
        boolean newItemData = savedInspectionDataService.checkNewItemData(data, existentData)

        then:
        newItemData
    }

    void "test check new item more existent than new data length"() {
        given:
        LocalDateTime now = LocalDateTime.now()
        Set<SavedItemData> data = [new SelectSavedItemData(saved: now)]
        Set<SavedItemData> existentData = [
            new SelectSavedItemData(saved: now), new SelectSavedItemData(saved: now.plusMinutes(10))
        ]

        when:
        boolean newItemData = savedInspectionDataService.checkNewItemData(data, existentData)

        then:
        !newItemData
    }

    // endregion

}
