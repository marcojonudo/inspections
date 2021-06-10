package inspections.services.data

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.domains.fviberi.VehicleInfo
import inspections.utils.Constants

@Service(VehicleInfo)
@Transactional(connection = Constants.DataSource.FVIBERI)
interface VehicleInfoDataService {

	VehicleInfo find(String numberPlate)

}
