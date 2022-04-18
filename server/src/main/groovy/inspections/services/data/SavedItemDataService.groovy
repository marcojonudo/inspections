package inspections.services.data

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.domains.items.Item
import inspections.domains.savedItems.SavedItem

import javax.inject.Inject
import java.time.LocalDateTime

@Service(SavedItem)
abstract class SavedItemDataService {

	@Inject ImageDataService imageDataService
	@Inject TextSavedItemDataService textSavedItemDataService
	@Inject SelectSavedItemDataService selectSavedItemDataService
	@Inject TextAreaSavedItemDataService textAreaSavedItemDataService

	abstract SavedItem save(SavedItem savedItem)

	abstract SavedItem update(
		Serializable id, String employeeCode, boolean hidden, boolean restrictive, Long imageId, LocalDateTime filled
	)

	@Transactional
	SavedItem update(SavedItem existent, SavedItem savedItem, List<Item> items) {
		update(
			existent.id,
			savedItem.employeeCode,
			savedItem.hidden,
			savedItem.restrictive,
			savedItem.imageId,
			savedItem.filled
		)
		if (existent.imageId && !savedItem.imageId) {
			imageDataService.delete(existent.imageId)
		}
		Item item = items.find { it.code == savedItem.itemCode }
		return ((Closure<SavedItem>) item.type.updateSavedItem)(existent, savedItem, this)
	}

}
