package inspections.services.data

import grails.gorm.services.Query
import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.domains.fviberi.OrderLine
import inspections.utils.Constants

@Service(OrderLine)
@Transactional(connection = Constants.DataSource.FVIBERI)
interface OrderLineDataService {

	@Query("select $line.article from ${OrderLine line} where $line.orderNumber = $orderNumber and $line.article != 0")
	List<Integer> findArticles(int orderNumber)

}
