package inspections.services.data

import grails.gorm.services.Service
import inspections.domains.SavedInspection

import javax.inject.Inject

@Service(SavedInspection)
abstract class SavedInspectionDataService {

	@Inject ItemDataService itemDataService

	abstract SavedInspection saveSavedInspection(SavedInspection savedInspection)

	SavedInspection save(SavedInspection savedInspection) {
		savedInspection.items.each {
			it.savedInspection = savedInspection
			it.item.id = itemDataService.find(it.item.name, it.item.category.code).id
		}
		return saveSavedInspection(savedInspection)
	}

}
