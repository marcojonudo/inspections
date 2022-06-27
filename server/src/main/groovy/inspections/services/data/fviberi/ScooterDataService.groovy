package inspections.services.data.fviberi

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.domains.fviberi.vehicle.Scooter
import inspections.utils.Constants

@Service(Scooter)
@Transactional(connection = Constants.DataSource.FVIBERI)
interface ScooterDataService {

	Scooter find(String serialNumber)

}
