package inspections.services.data


import grails.gorm.services.Service
import inspections.domains.SavedInspection
import inspections.domains.items.Item
import inspections.domains.savedItems.SavedItem
import inspections.utils.Utils

import javax.inject.Inject

@Service(SavedInspection)
abstract class SavedInspectionDataService {

	@Inject ItemDataService itemDataService
	@Inject SavedItemDataService savedItemDataService

	abstract SavedInspection find(int orderNumber)

	abstract SavedInspection save(SavedInspection savedInspection)

	abstract SavedInspection update(Serializable id, String employeeCode, SavedInspection.State state)

	abstract SavedInspection update(Serializable id, String inspectionTypeCode, boolean orderInspection)

	SavedInspection update(SavedInspection savedInspection, SavedInspection existentSavedInspection) {
		List<Item> items = itemDataService.findAll((List<String>) savedInspection.items.code)
		savedInspection.items.each { SavedItem savedItem ->
			SavedItem existentSavedItem = existentSavedInspection.items.find { it.code == savedItem.code }
			if (!existentSavedItem) {
				fillSavedItem(savedItem, existentSavedInspection)
				savedItemDataService.save(savedItem)
			} else if (savedItem != existentSavedItem) {
				Item item = Utils.findItem(savedItem.code, items)
				savedItemDataService.update(existentSavedItem, savedItem, item)
			}
		}
		SavedInspection.State state = SavedInspection.State.values().find {
			((Closure<Boolean>) it.check)(savedInspection.items, items)
		}
		return update(existentSavedInspection.id, savedInspection.employeeCode, state)
	}

	static SavedItem fillSavedItem(SavedItem savedItem, SavedInspection savedInspection) {
		savedItem.savedInspection = savedInspection
		savedItem.fillRelations()
		return savedItem
	}

}
