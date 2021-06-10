package inspections.services.data

import grails.gorm.services.Service
import inspections.domains.savedItems.SavedItem

import javax.inject.Inject

@Service(SavedItem)
abstract class SavedItemDataService {

	@Inject TextSavedItemDataService textSavedItemDataService
	@Inject SelectSavedItemDataService selectSavedItemDataService

	SavedItem update(Serializable id, SavedItem savedItem) {
		return ((Closure<SavedItem>) savedItem.item.type.updateSavedItem)(id, savedItem, this)
	}

}
