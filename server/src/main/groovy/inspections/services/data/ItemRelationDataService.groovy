package inspections.services.data

import grails.gorm.services.Service
import inspections.domains.ItemRelation

@Service(ItemRelationDataService)
interface ItemRelationDataService {

	List<ItemRelation> findAll()

}
