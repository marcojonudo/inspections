package inspections.services.data

import grails.gorm.services.Service
import grails.gorm.services.Where
import grails.gorm.transactions.Transactional
import inspections.domains.fviberi.Order
import inspections.utils.Constants

import javax.inject.Inject

@Service(Order)
@Transactional(connection = Constants.DataSource.FVIBERI)
abstract class OrderDataService {

	@Inject OrderTimeDataService orderTimeDataService

	abstract Order find(int number)

	@Where({ number in numbers && !(state in ['V', 'F', 'X']) })
	abstract Order find(List<Integer> numbers)

	Integer find(String shortCode) {
		List<Integer> numbers = orderTimeDataService.findOrderTimeOrderNumber(
			shortCode, [sort: 'day', order: 'desc', max: 3]
		)
		return numbers ? find(numbers)?.number : null
	}

}
