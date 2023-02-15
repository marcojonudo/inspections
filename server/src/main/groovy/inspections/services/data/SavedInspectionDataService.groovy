package inspections.services.data

import grails.gorm.services.Service
import inspections.domains.SavedInspection
import inspections.domains.SavedInspectionData
import inspections.domains.items.Item
import inspections.domains.savedItems.SavedItem
import inspections.domains.savedItems.SavedItemData
import inspections.pogos.logs.Log
import inspections.services.InspectionService
import inspections.utils.Constants
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.inject.Inject
import java.time.LocalDateTime

@Service(SavedInspection)
abstract class SavedInspectionDataService {

	private static final Logger LOG = LoggerFactory.getLogger(SavedInspectionDataService)

	@Inject ItemDataService itemDataService
	@Inject ImageDataService imageDataService

	abstract SavedInspection find(int orderNumber)

	abstract SavedInspection save(SavedInspection savedInspection)

	SavedInspection update(
		SavedInspection savedInspection, String inspectionTypeCode, boolean orderInspection, String employeeCode
	) {
		savedInspection.inspectionTypeCode = inspectionTypeCode
		savedInspection.orderInspection = orderInspection

		SavedInspectionData newData = new SavedInspectionData(
			employeeCode, SavedInspectionData.Reason.UPDATED_ORDER, LocalDateTime.now()
		)
		savedInspection.addToData(newData)
		return save(savedInspection)
	}

	SavedInspection update(SavedInspection savedInspection, SavedInspection existentSavedInspection) {
		List<Item> items = itemDataService.findAll((List<String>) savedInspection.items.code)

		LOG.info(new Log((Map) [message: Constants.Message.EXISTENT_INSPECTION_SAVED, orderNumber: savedInspection.orderNumber, employeeCode: savedInspection.findData().employeeCode, saved: existentSavedInspection.data.saved.sort()*.toString()]).toString())
		SavedInspectionData newSavedInspectionData = savedInspection.data
			.max { it.saved }
			.tap { it.savedInspection = existentSavedInspection }
		LOG.info(new Log((Map) [message: Constants.Message.NEW_DATA_SAVED, orderNumber: savedInspection.orderNumber, employeeCode: savedInspection.findData().employeeCode, saved: newSavedInspectionData.saved.toString()]).toString())
		existentSavedInspection.addToData(newSavedInspectionData)
		savedInspection.items.each { SavedItem savedItem ->
			SavedItem existentSavedItem = existentSavedInspection.items.find { it.code == savedItem.code }
			/* Si el item no existe, se crea. Ocurre en anomalías detectadas, si después de guardar la revisión
			 * completa rellena algún otro item*/
			if (!existentSavedItem) {
				existentSavedInspection.addToItems(savedItem.fill())
			} else if (checkNewItemData(savedItem.data, existentSavedItem.data)) {
				addSavedItem(savedItem, existentSavedItem)
			}
		}
		existentSavedInspection.state = findState(savedInspection, items)
		existentSavedInspection.duration = InspectionService.findInspectionDuration(savedInspection.data)
			.orElseGet { null }
		return save(existentSavedInspection)
	}

	static boolean checkNewItemData(Set<SavedItemData> data, Set<SavedItemData> existentData) {
		return data.saved.max() > existentData.saved.max()
	}

	void addSavedItem(SavedItem savedItem, SavedItem existentSavedItem) {
		/* Si hay algún elemento nuevo en el array 'data', significa que se ha modificado en el front */
		SavedItemData data = savedItem.data.max { it.saved }
		SavedItemData existentSavedData = existentSavedItem.data.max { it.saved }
		data.fill(existentSavedItem)

		/* Si se ha eliminado la foto, directamente se borra de BD para que no ocupe espacio innecesario, ya que la
		 * imagen no es importante en el histórico */
		if (existentSavedData.imageId && !data.imageId) {
			imageDataService.delete(existentSavedData.imageId)
		}
		existentSavedItem.addToData(data)
	}

	static SavedInspection.State findState(SavedInspection savedInspection, List<Item> items) {
		return SavedInspection.State.values().find {
			((Closure<Boolean>) it.check)(savedInspection.items, items)
		}
	}

}
