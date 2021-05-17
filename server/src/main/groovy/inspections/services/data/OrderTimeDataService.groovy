package inspections.services.data


import grails.gorm.services.Service
import inspections.domains.fviberi.OrderTime

@Service(OrderTime)
interface OrderTimeDataService {

	int findOrderTimeOrderNumber(String shortCode, Map args)

}
