package inspections.services.data

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.domains.SavedInspection

import javax.inject.Inject

@Service(SavedInspection)
abstract class SavedInspectionDataService {

	@Inject ItemDataService itemDataService

	abstract SavedInspection find(int orderNumber)

	abstract SavedInspection saveSavedInspection(SavedInspection savedInspection)

	@Transactional
	SavedInspection save(SavedInspection savedInspection) {
		savedInspection.items.each {
			it.savedInspection = savedInspection
			it.item = itemDataService.find(it.item.name, it.item.category.code)
		}
		return saveSavedInspection(savedInspection)
	}

}
