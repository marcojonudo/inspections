package inspections.services.data

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.domains.SavedInspection
import inspections.domains.SavedInspectionData
import inspections.domains.items.Item
import inspections.domains.savedItems.SavedItem
import inspections.domains.savedItems.SavedItemData

import javax.inject.Inject
import java.time.LocalDateTime

@Service(SavedInspection)
abstract class SavedInspectionDataService {

	@Inject ItemDataService itemDataService

	abstract SavedInspection find(int orderNumber)

	abstract SavedInspection save(SavedInspection savedInspection)

	abstract SavedInspection update(
		Serializable id, String employeeCode, SavedInspection.State state, LocalDateTime saved
	)

	abstract SavedInspection update(
		Serializable id, String inspectionTypeCode, boolean orderInspection, LocalDateTime saved
	)

	SavedInspection update(SavedInspection savedInspection, SavedInspection existentSavedInspection) {
		List<Item> items = itemDataService.findAll((List<String>) savedInspection.items.code)

		SavedInspectionData newSavedInspectionData = savedInspection.data
			.max { it.saved }
			.tap { it.savedInspection = existentSavedInspection }
		existentSavedInspection.addToData(newSavedInspectionData)
		savedInspection.items.each { SavedItem savedItem ->
			SavedItem existentSavedItem = existentSavedInspection.items.find { it.item.code == savedItem.item.code }
			/* Si el item no existe, se crea. Ocurre en anomalías detectadas, si después de guardar la revisión
			 * completa rellena algún otro item*/
			if (!existentSavedItem) {
				fillSavedItem(savedItem, existentSavedInspection)
				existentSavedInspection.addToItems(savedItem)
			} else if (savedItem.data.size() != existentSavedItem.data.size()) {
				/* Si hay algún elemento nuevo en el array 'data', significa que se ha modificado en el front */
				SavedItemData data = savedItem.data.max { it.filled }
				data.fill(existentSavedItem)
				existentSavedItem.addToData(data)
			}
		}
		existentSavedInspection.state = SavedInspection.State.values().find {
			((Closure<Boolean>) it.check)(savedInspection.items, items)
		}
		return save(existentSavedInspection)
	}

	static SavedItem fillSavedItem(SavedItem savedItem, SavedInspection savedInspection) {
		savedItem.savedInspection = savedInspection
		savedItem.data.each { it.fill(savedItem) }
	}

}
