package inspections.services.data


import grails.gorm.services.Service
import inspections.domains.items.Item

@Service(Item)
interface ItemDataService {

//	@Query("""
//		select $item
//		from ${Item item}
//		inner join $item.inspections as inspections
//		where $inspection.id in inspections
//	""")
//	Set<Item> findAll(Inspection inspection)

//	@Query("""
//		select $item
//		from ${Item item}
//		inner join ${ItemCategory category = item.category}
//		where $item.code = $code and $category.code = $categoryCode
//	""")
//	Item find(String code, String categoryCode)

//	Item find(String code)

}
