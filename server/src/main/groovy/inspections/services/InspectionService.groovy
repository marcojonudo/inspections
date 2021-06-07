package inspections.services

import groovy.transform.CompileStatic
import inspections.domains.Inspection
import inspections.domains.SavedInspection
import inspections.domains.fviberi.Order
import inspections.domains.items.Item
import inspections.domains.savedItems.SavedItem
import inspections.pogos.InspectionInfo
import inspections.services.data.*

import javax.inject.Inject
import javax.inject.Singleton

@Singleton
@CompileStatic
class InspectionService {

	@Inject OrderTimeDataService orderTimeDataService
	@Inject OrderDataService orderDataService
	@Inject InspectionDataService inspectionDataService
	@Inject SavedInspectionDataService savedInspectionDataService
	@Inject SavedItemDataService savedItemDataService

	/**
	 * Busca una orden asociada al código corto
	 * @param shortCode Código corto de la orden
	 * @return Orden
	 */
	Order findOrder(String shortCode) {
		Integer orderNumber = orderTimeDataService.findOrderTimeOrderNumber(
			shortCode, [sort: 'orderNumber', order: 'desc', max: 1]
		)
		return orderNumber ? orderDataService.find(orderNumber) : null
	}

	/**
	 * Busca la revisión y la revisión guardad asociadas al número de orden
	 * @param orderNumber Número de orden
	 * @return Objecto con revisión y revisión guardada
	 */
	InspectionInfo findInspectionInfo(int orderNumber) {
		Inspection inspection = buildInspection(orderNumber)
		SavedInspection existent = savedInspectionDataService.find(orderNumber)
		return inspection ? new InspectionInfo(inspection, existent) : null
	}

	/**
	 * Construye una revisión aglutinando los elementos asociados a los códigos de mano de obra de una orden
	 * @param orderNumber Número de orden
	 * @return
	 */
	Inspection buildInspection(int orderNumber) {
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

	/**
	 * Guarda o actualiza una revisión
	 * @param inspection Revisión
	 * @param orderNumber Número de orden
	 * @return Revisión guardada
	 */
	SavedInspection saveInspection(SavedInspection inspection, int orderNumber) {
		SavedInspection savedInspection = null
		try {
			savedInspection = savedInspectionDataService.find(orderNumber)
			/* Si existe una revisión para ese número de serie, se actualizan los elementos */
			if (savedInspection) {
				savedInspection.items.each { SavedItem existentSavedItem ->
					SavedItem savedItem = inspection.items.find { it.item.name == existentSavedItem.item.name }
					if (existentSavedItem != savedItem) {
						savedItemDataService.update(existentSavedItem.id, savedItem)
					}
				}
			} else {
				savedInspection = savedInspectionDataService.save(inspection)
			}
		} catch (all) {
			all.printStackTrace()
		}
		return savedInspection
	}

}
