package inspections.services.data

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.domains.fviberi.Order
import inspections.utils.Constants

@Service(Order)
@Transactional(connection = Constants.DataSource.FVIBERI)
interface OrderDataService {

	Order find(int number)

}
