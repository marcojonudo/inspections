package inspections.services.data.fviberi

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.domains.fviberi.vehicle.Bike
import inspections.utils.Constants

@Service(Bike)
@Transactional(connection = Constants.DataSource.FVIBERI)
interface BikeDataService {

	Bike find(String serialNumber)

}
