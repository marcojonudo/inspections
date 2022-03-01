package inspections.services.data


import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.domains.fviberi.OrderTime
import inspections.utils.Constants

@Service(OrderTime)
@Transactional(connection = Constants.DataSource.FVIBERI)
interface OrderTimeDataService {

	OrderTime find(Integer orderNumber)

	List<Integer> findOrderTimeOrderNumber(String shortCode, Map args)

}
