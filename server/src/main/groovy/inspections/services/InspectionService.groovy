package inspections.services

import grails.gorm.transactions.Transactional
import groovy.transform.CompileStatic
import inspections.domains.Inspection
import inspections.domains.fviberi.Order
import inspections.services.data.OrderDataService
import inspections.services.data.OrderLineDataService
import inspections.services.data.OrderTimeDataService
import inspections.utils.Constants

import javax.inject.Inject
import javax.inject.Singleton

@Singleton
@CompileStatic
class InspectionService {

	@Inject OrderTimeDataService orderTimeDataService
	@Inject OrderLineDataService orderLineDataService
	@Inject OrderDataService orderDataService

	Order findOrder(String shortCode) {
		Integer orderNumber = orderTimeDataService.findOrderTimeOrderNumber(
			shortCode, [sort: 'orderNumber', order: 'desc', max: 1]
		)
		return orderNumber ? orderDataService.find(orderNumber) : null
	}

	List<Inspection> findAll(int orderNumber) {
		List<Integer> articles = []//orderLineDataService.findArticles(orderNumber)
		return [new Inspection(code: 'A', name: 'Test')]
	}

	List<Inspection> findAll(String shortCode) {
		List<Integer> articles = findArticleCodes(shortCode)
		return []
	}

	@Transactional(connection = Constants.DataSource.FVIBERI)
	List<Integer> findArticleCodes(String shortCode) {
		int orderNumber = orderTimeDataService.findOrderTimeOrderNumber(shortCode, [sort: 'orderNumber', order: 'desc', max: 1])
		return []//orderLineDataService.findArticles(orderNumber)
	}

}
