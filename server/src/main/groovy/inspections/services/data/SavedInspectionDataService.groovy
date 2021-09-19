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

	@Transactional
	SavedInspection save(SavedInspection savedInspection) {
		savedInspection.items.each {
			it.savedInspection = savedInspection
			it.item = itemVehicleDataDataService.find(it.item.code)
		}
		savedInspection.state = SavedInspection.State.values().find {
			((Closure<Boolean>) it.check)(savedInspection.items)
		}
		return saveSavedInspection(savedInspection)
	}

	SavedInspection update(SavedInspection savedInspection, SavedInspection existentSavedInspection) {
		existentSavedInspection.items.each { SavedItem existentSavedItem ->
			SavedItem savedItem = savedInspection.items.find { it.item.code == existentSavedItem.item.code }
			if (existentSavedItem != savedItem) {
				savedItemDataService.update(existentSavedItem, savedItem)
			}
		}
		SavedInspection.State state = SavedInspection.State.values().find {
			((Closure<Boolean>) it.check)(savedInspection.items)
		}
		return update(existentSavedInspection.id, state)
	}

}
