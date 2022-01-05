package inspections.services.data

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.domains.SavedInspection
import inspections.domains.savedItems.SavedItem

import javax.inject.Inject

@Service(SavedInspection)
abstract class SavedInspectionDataService {

	@Inject ItemDataService itemDataService
	@Inject SavedItemDataService savedItemDataService
	@Inject ItemVehicleDataDataService itemVehicleDataDataService

	abstract SavedInspection find(int orderNumber)

	abstract SavedInspection saveSavedInspection(SavedInspection savedInspection)

	abstract SavedInspection update(Serializable id, SavedInspection.State state)

	abstract SavedInspection update(Serializable id, boolean orderInspection)

	@Transactional
	SavedInspection save(SavedInspection savedInspection) {
		savedInspection.items.each { fillSavedItem(it, savedInspection) }
		savedInspection.state = SavedInspection.State.values().find {
			((Closure<Boolean>) it.check)(savedInspection.items)
		}
		return saveSavedInspection(savedInspection)
	}

	SavedInspection update(SavedInspection savedInspection, SavedInspection existentSavedInspection) {
		savedInspection.items.each { SavedItem savedItem ->
			SavedItem existentSavedItem = existentSavedInspection.items.find { it.item.code == savedItem.item.code }
			if (!existentSavedItem) {
				fillSavedItem(savedItem, existentSavedInspection)
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

	void fillSavedItem(SavedItem savedItem, SavedInspection savedInspection) {
		savedItem.savedInspection = savedInspection
		savedItem.item = itemVehicleDataDataService.find(savedItem.item.code)
		savedItem.fillRelations()
	}

}
