package inspections.services.data

import grails.gorm.services.Query
import grails.gorm.services.Service
import inspections.domains.Inspection
import inspections.domains.items.Item

@Service(Item)
interface ItemDataService {

	@Query("""
		select $item
		from ${Item item}
		inner join $item.inspections as inspections
		where $inspection.id in inspections
	""")
	Set<Item> findAll(Inspection inspection)

}
