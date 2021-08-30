package inspections.services.data

import grails.gorm.services.Query
import grails.gorm.services.Service
import inspections.domains.Inspection
import inspections.domains.InspectionInternalCode
import inspections.utils.Builder

import javax.inject.Inject

@Service(Inspection)
abstract class InspectionDataService {

	@Inject ItemDataService itemDataService

	abstract List<Inspection> findAllInspections()

	List<Inspection> findAll() {
		List<Inspection> inspections = findAllInspections()
		return inspections.collect { Builder.buildInspection(it, itemDataService.findAll((Inspection) it)) }
	}

	@Query("""
		select $inspection
		from ${Inspection inspection}
		join ${InspectionInternalCode code = inspection.internalCodes}
		where $code.code in $internalCodes
	""")
	abstract List<Inspection> findAll(List<Integer> internalCodes)

}
