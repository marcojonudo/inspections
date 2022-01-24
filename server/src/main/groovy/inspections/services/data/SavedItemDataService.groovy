package inspections.services.data

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.domains.Image
import inspections.domains.savedItems.SavedItem

import javax.inject.Inject
import java.time.LocalDateTime

@Service(SavedItem)
abstract class SavedItemDataService {

	@Inject ImageDataService imageDataService
	@Inject TextSavedItemDataService textSavedItemDataService
	@Inject SelectSavedItemDataService selectSavedItemDataService
	@Inject TextAreaSavedItemDataService textAreaSavedItemDataService

	abstract SavedItem update(
		Serializable id, String employeeCode, boolean hidden, boolean restrictive, LocalDateTime filled
	)

	abstract SavedItem update(Serializable id, Image image)

	abstract SavedItem save(SavedItem savedItem)

	@Transactional
	SavedItem update(SavedItem existent, SavedItem savedItem) {
		update(existent.id, savedItem.employeeCode, savedItem.hidden, savedItem.restrictive, savedItem.filled)
		if (existent.image != savedItem.image) {
			updateImage(existent, savedItem.image)
		}
		return ((Closure<SavedItem>) savedItem.item.type.updateSavedItem)(existent, savedItem, this)
	}

	void updateImage(SavedItem existent, Image image) {
		if (image) {
			existent.image ? imageDataService.update(existent.image.id, image.image, image.landscape) : update(existent.id, image)
		} else {
			update(existent.id, null)
			imageDataService.delete(existent.image.id)
		}
	}

}
