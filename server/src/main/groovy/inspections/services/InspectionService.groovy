package inspections.services

import grails.gorm.transactions.Transactional
import groovy.transform.CompileStatic
import inspections.domains.Inspection
import inspections.domains.fviberi.Order
import inspections.domains.items.Item
import inspections.services.data.InspectionDataService
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
	@Inject InspectionDataService inspectionDataService

	Order findOrder(String shortCode) {
		Integer orderNumber = orderTimeDataService.findOrderTimeOrderNumber(
			shortCode, [sort: 'orderNumber', order: 'desc', max: 1]
		)
		return orderNumber ? orderDataService.find(orderNumber) : null
	}

	Inspection findInspection(int orderNumber) {
		List<Integer> articles = orderDataService.find(orderNumber).lines*.articleCode.toList()
		List<Inspection> inspections = inspectionDataService.findAll(articles)
		return buildGroupedInspection(inspections)
	}

	/**
	 * Construye una revisión agrupada con todos los items de las recibidas como parámetro
	 * @param inspections Lista de revisiones
	 * @return Revisión con items agrupados
	 */
	static Inspection buildGroupedInspection(List<Inspection> inspections) {
		Inspection inspection = null
		if (inspections) {
			/* Se obtiene el nombre de la revisión con mayor número de items */
			String name = inspections.max { it.items.size() }.name
			List<Item> items = ((List<Item>) inspections.items.flatten()).unique { it.name }
			inspection = new Inspection(name: name, items: items.toSet())
		}
		return inspection
	}

	List<Inspection> findAll(int orderNumber) {
		List<Integer> articles = orderDataService.find(orderNumber).lines*.articleCode.toList()
		return inspectionDataService.findAll(articles)
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
