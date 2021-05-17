package inspections.services.data

import grails.gorm.services.Query
import grails.gorm.services.Service
import inspections.domains.fviberi.OrderLine

@Service(OrderLine)
interface OrderLineDataService {

	@Query("select $line.article from ${OrderLine line} where $line.orderNumber = $orderNumber and $line.article != 0")
	List<Integer> findArticles(int orderNumber)

}
