package inspections.services.data

import grails.gorm.services.Service
import inspections.domains.SavedInspection
import inspections.domains.items.Item
import inspections.domains.savedItems.SavedItem

import javax.inject.Inject

@Service(SavedInspection)
abstract class SavedInspectionDataService {

	@Inject ItemDataService itemDataService
	@Inject SavedItemDataService savedItemDataService

	abstract SavedInspection find(int orderNumber)

	abstract SavedInspection saveSavedInspection(SavedInspection savedInspection)

	abstract SavedInspection update(Serializable id, SavedInspection.State state)

	abstract SavedInspection update(Serializable id, String inspectionTypeCode, boolean orderInspection)

	SavedInspection update(SavedInspection savedInspection, SavedInspection existentSavedInspection) {
		List<Item> items = itemDataService.findAll((List<String>) savedInspection.items.item.code)
		savedInspection.items.each { SavedItem savedItem ->
			SavedItem existentSavedItem = existentSavedInspection.items.find { it.item.code == savedItem.item.code }
			if (!existentSavedItem) {
				fillSavedItem(savedItem, existentSavedInspection, items)
				savedItemDataService.save(savedItem)
			} else if (savedItem != existentSavedItem) {
				savedItemDataService.update(existentSavedItem, savedItem)
			}
		}
		SavedInspection.State state = SavedInspection.State.values().find {
			((Closure<Boolean>) it.check)(savedInspection.items)
		}
		return update(existentSavedInspection.id, state)
	}

	static SavedItem fillSavedItem(SavedItem savedItem, SavedInspection savedInspection, List<Item> items) {
		savedItem.savedInspection = savedInspection
		savedItem.item = items.find { it.code == savedItem.item.code }
		savedItem.fillRelations()
		return savedItem
	}

}
