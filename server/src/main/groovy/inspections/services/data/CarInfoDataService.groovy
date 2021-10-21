package inspections.services.data

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.domains.fviberi.vehicle.CarInfo
import inspections.utils.Constants

@Service(CarInfo)
@Transactional(connection = Constants.DataSource.FVIBERI)
interface CarInfoDataService {

	CarInfo find(String numberPlate)

}
