package inspections.services.data

import grails.gorm.services.Service
import inspections.domains.Inspection
import inspections.utils.Builder

import javax.inject.Inject

@Service(Inspection)
abstract class InspectionDataService {

	@Inject ItemDataService itemDataService

	abstract List<Inspection> findAllInspections()

	List<Inspection> findAll() {
		List<Inspection> inspections = findAllInspections()
		return inspections.collect { Builder.buildInspection(it, itemDataService.findAll(it)) }
	}

}
