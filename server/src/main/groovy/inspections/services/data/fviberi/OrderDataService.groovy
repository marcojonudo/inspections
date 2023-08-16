package inspections.services.data.fviberi

import grails.gorm.services.Service
import grails.gorm.services.Where
import grails.gorm.transactions.Transactional
import inspections.domains.fviberi.Order
import inspections.domains.fviberi.OrderTime
import inspections.domains.fviberi.vehicle.IVehicle
import inspections.pogos.vehicles.VehicleType
import inspections.utils.Constants

import javax.inject.Inject

@Service(Order)
@Transactional(connection = Constants.DataSource.FVIBERI)
abstract class OrderDataService {

	@Inject OrderTimeDataService orderTimeDataService
	@Inject CarDataService carDataService
	@Inject ScooterDataService scooterDataService
	@Inject BikeDataService bikeDataService

	abstract Order findOrder(int number)

	@Where({ number in numbers && !(state in ['V', 'F', 'X']) })
	abstract Order find(List<Integer> numbers)

	Integer find(String shortCode) {
		List<Integer> numbers = orderTimeDataService.findOrderTimeOrderNumber(
			shortCode, [sort: 'day', order: 'desc', max: 3]
		)
		return numbers ? find(numbers)?.number : null
	}

	Order find(int number) {
		Order order = findOrder(number)
		if (order) {
			OrderTime orderTime = orderTimeDataService.find(number)

			order.code = orderTime.shortCode

			VehicleType vehicleType = VehicleType.values().find { it.type == order.vehicleType }
			order.vehicleType = vehicleType.type
			IVehicle vehicle = ((Closure<IVehicle>) vehicleType.find)(this, order.carIdentifier)
			order.vehicle = vehicle.buildVehicle()
		}
		return order
	}

}
