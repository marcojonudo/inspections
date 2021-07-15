package inspections.services

import groovy.transform.CompileStatic
import inspections.domains.Inspection
import inspections.domains.SavedInspection
import inspections.domains.fviberi.Centre
import inspections.domains.fviberi.Order
import inspections.domains.items.Item
import inspections.domains.savedItems.SavedItem
import inspections.pogos.InspectionInfo
import inspections.pogos.OrderInfo
import inspections.pogos.logs.Log
import inspections.services.data.*
import inspections.utils.Constants
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.inject.Inject
import javax.inject.Singleton

@Singleton
@CompileStatic
class InspectionService {

	private static final Logger LOG = LoggerFactory.getLogger(InspectionService)

	@Inject OrderTimeDataService orderTimeDataService
	@Inject OrderDataService orderDataService
	@Inject CentreDataService centreDataService
	@Inject VehicleInfoDataService vehicleInfoDataService
	@Inject InspectionDataService inspectionDataService
	@Inject SavedInspectionDataService savedInspectionDataService
	@Inject SavedItemDataService savedItemDataService

	/**
	 * Busca una orden asociada al código corto
	 * @param shortCode Código corto de la orden
	 * @return Orden
	 */
	OrderInfo findOrderInfo(String shortCode) {
		Integer orderNumber = orderTimeDataService.findOrderTimeOrderNumber(
			shortCode, [sort: 'day', order: 'desc', max: 1]
		)
		OrderInfo orderInfo = null
		if (orderNumber) {
			Order order = orderDataService.find(orderNumber)
			order.vehicle.extraInfo = vehicleInfoDataService.find(order.vehicle.numberPlate)
			Centre centre = centreDataService.find()

			orderInfo = new OrderInfo(order, centre)
		}
		return orderInfo
	}

	/**
	 * Busca la revisión y la revisión guardad asociadas al número de orden
	 * @param orderNumber Número de orden
	 * @return Objecto con revisión y revisión guardada
	 */
	InspectionInfo findInspectionInfo(int orderNumber) {
		LOG.info(new Log((Map) [orderNumber: orderNumber, message: Constants.Message.FINDING_INSPECTION]).toString())
		Inspection inspection = buildInspection(orderNumber)
		SavedInspection existent = savedInspectionDataService.find(orderNumber)
		LOG.info(new Log((Map) [orderNumber: orderNumber, inspection: inspection?.name, savedInspection: existent?.name, message: Constants.Message.FIND_INSPECTION_RESULT]).toString())
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
	 * @param employeeCode Código del empleado que guarda la revisión
	 * @return Revisión guardada
	 */
	SavedInspection saveInspection(SavedInspection inspection, int orderNumber, String employeeCode) {
		LOG.info(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, inspection: inspection.name, message: Constants.Message.SAVING_INSPECTION]).toString())
		SavedInspection savedInspection = null
		try {
			SavedInspection existent = savedInspectionDataService.find(orderNumber)
			LOG.info(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, inspection: inspection.name, existent: existent as boolean, message: Constants.Message.EXISTENT_INSPECTION]).toString())

			/* Si existe una revisión para ese número de serie, se actualizan los elementos */
			if (existent) {
				existent.items.each { SavedItem existentSavedItem ->
					SavedItem savedItem = inspection.items.find { it.item.name == existentSavedItem.item.name }
					if (existentSavedItem != savedItem) {
						savedItemDataService.update(existentSavedItem.id, savedItem)
					}
				}
				savedInspection = existent
			} else {
				savedInspection = savedInspectionDataService.save(inspection)
			}
			LOG.info(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, inspection: inspection.name, message: Constants.Message.SAVED_INSPECTION]).toString())
		} catch (all) {
			all.printStackTrace()
			LOG.error(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, inspection: inspection.name, exceptionMessage: all.message, message: Constants.Message.ERROR_SAVING_INSPECTION]).toString())
		}
		return savedInspection
	}

}
