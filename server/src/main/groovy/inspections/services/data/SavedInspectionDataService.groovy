package inspections.services.data

import grails.gorm.services.Service
import inspections.domains.Image
import inspections.domains.SavedInspection
import inspections.domains.SavedInspectionData
import inspections.domains.items.Item
import inspections.domains.savedItems.SavedItem
import inspections.domains.savedItems.SavedItemData

import javax.inject.Inject

@Service(SavedInspection)
abstract class SavedInspectionDataService {

	@Inject ItemDataService itemDataService
	@Inject ImageDataService imageDataService

	abstract SavedInspection find(int orderNumber)

	abstract SavedInspection save(SavedInspection savedInspection)

	SavedInspection update(
		SavedInspection savedInspection, String inspectionTypeCode, boolean orderInspection, String employeeCode
	) {
		savedInspection.inspectionTypeCode = inspectionTypeCode
		savedInspection.orderInspection = orderInspection

		SavedInspectionData newData = new SavedInspectionData(employeeCode, SavedInspectionData.Reason.UPDATED_ORDER)
		savedInspection.addToData(newData)
		return save(savedInspection)
	}

	SavedInspection update(SavedInspection savedInspection, SavedInspection existentSavedInspection) {
		List<Item> items = itemDataService.findAll((List<String>) savedInspection.items.code)
		List<Image> images = imageDataService.findAll(existentSavedInspection.id)

		SavedInspectionData newSavedInspectionData = savedInspection.data
			.max { it.saved }
			.tap {
				it.savedInspection = existentSavedInspection
				it.reason = SavedInspectionData.Reason.UPDATED
			}
		existentSavedInspection.addToData(newSavedInspectionData)
		savedInspection.items.each { SavedItem savedItem ->
			SavedItem existentSavedItem = existentSavedInspection.items.find { it.code == savedItem.code }
			/* Si el item no existe, se crea. Ocurre en anomalías detectadas, si después de guardar la revisión
			 * completa rellena algún otro item*/
			if (!existentSavedItem) {
				fillSavedItem(savedItem, existentSavedInspection)
				existentSavedInspection.addToItems(savedItem)
			} else if (savedItem.data.size() != existentSavedItem.data.size()) {
				addSavedItem(savedItem, existentSavedItem)
			}
			handleImages(savedItem, images)
		}
		existentSavedInspection.state = findState(savedInspection, items)
		return save(existentSavedInspection)
	}

	static void fillSavedItem(SavedItem savedItem, SavedInspection savedInspection) {
		savedItem.savedInspection = savedInspection
		savedItem.data.each { it.fill(savedItem) }
	}

	void addSavedItem(SavedItem savedItem, SavedItem existentSavedItem) {
		/* Si hay algún elemento nuevo en el array 'data', significa que se ha modificado en el front */
		SavedItemData data = savedItem.data.max { it.filled }
		SavedItemData existentSavedData = existentSavedItem.data.max { it.filled }
		data.fill(existentSavedItem)

		/* Si se ha eliminado la foto, directamente se borra de BD para que no ocupe espacio innecesario, ya que la
		 * imagen no es importante en el histórico */
		if (existentSavedData.imageId && !data.imageId) {
			imageDataService.delete(existentSavedData.imageId)
		}
		existentSavedItem.addToData(data)
	}

	void handleImages(SavedItem savedItem, List<Image> images) {
		/* Se obtienen las imágenes asociadas al item */
		List<Image> itemImages = images.findAll { it.itemCode == savedItem.code }
		itemImages.each { Image image ->
			/* Se comprueba si el item tiene asociada alguna imagen. Si no es así, significa que sacaron la foto pero
			 * posteriormente la borraron, ya fuera para sacar otra o para dejarla vacía */
			SavedItemData associatedData = savedItem.data.find { it.imageId == image.id }
			if (!associatedData) {
				imageDataService.delete(image.id)
			}
		}
	}

	static SavedInspection.State findState(SavedInspection savedInspection, List<Item> items) {
		return SavedInspection.State.values().find {
			((Closure<Boolean>) it.check)(savedInspection.items, items)
		}
	}

}
