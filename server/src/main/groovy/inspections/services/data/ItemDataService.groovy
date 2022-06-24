package inspections.services.data

import grails.gorm.services.Query
import grails.gorm.services.Service
import grails.gorm.services.Where
import inspections.domains.items.Item

@Service(Item)
interface ItemDataService {

	Long findItemId(String code)

	@Query("select $item.id from ${Item item} where $item.code in $codes")
	List<Long> findAllItemId(List<String> codes)

	@Where({ code in codes })
	List<Item> findAll(List<String> codes)

}
