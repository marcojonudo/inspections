package inspections.services.data.fviberi

import grails.gorm.services.Query
import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.domains.fviberi.vehicle.Car
import inspections.domains.fviberi.vehicle.CarInfo
import inspections.pogos.logs.Log
import inspections.utils.Constants
import inspections.utils.Utils
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.inject.Inject

@Service(Car)
@Transactional(connection = Constants.DataSource.FVIBERI)
abstract class CarDataService {

	private static final Logger LOG = LoggerFactory.getLogger(CarDataService)

	@Inject private CarInfoDataService carInfoDataService

	abstract Car findCar(String numberPlate)

	@Query("""
		update ${Car car}
		set $car.itvDate = $itvDate, $car.expiredItv = $expiredItv
		where $car.numberPlate = $numberPlate
	""")
	abstract Number update(String numberPlate, String itvDate, String expiredItv)

	Car find(String numberPlate) {
		Car car = findCar(numberPlate)
		if (car) {
			CarInfo carInfo = carInfoDataService.find(numberPlate)
			if (carInfo) {
				car.engineCode = carInfo.engineCode
				try {
					car.power = carInfo.power ? Utils.kwToCv(carInfo.power as float) as String : carInfo.power
				} catch (all) {
					LOG.error(new Log((Map) [message: Constants.Message.CALC_POWER_ERROR, vehicleId: numberPlate]).toString(), all)
				}
			}
		}
		return car
	}

}
