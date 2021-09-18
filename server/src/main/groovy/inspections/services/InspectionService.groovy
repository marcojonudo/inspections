package inspections.services

import groovy.transform.CompileStatic
import inspections.domains.InspectionVehicle
import inspections.domains.SavedInspection
import inspections.domains.fviberi.Centre
import inspections.domains.fviberi.Order
import inspections.domains.items.Item
import inspections.pogos.OrderInfo
import inspections.pogos.logs.Log
import inspections.services.data.*
import inspections.utils.Builder
import inspections.utils.Constants
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.inject.Inject
import javax.inject.Singleton

@Singleton
@CompileStatic
class InspectionService {

	private static final Logger LOG = LoggerFactory.getLogger(InspectionService)

	@Inject OrderDataService orderDataService
	@Inject CentreDataService centreDataService
	@Inject VehicleInfoDataService vehicleInfoDataService
	@Inject InspectionVehicleDataService inspectionVehicleDataService
	@Inject SavedInspectionDataService savedInspectionDataService
	@Inject SavedItemDataService savedItemDataService

	/**
	 * Busca una orden asociada al código corto
	 * @param shortCode Código corto de la orden
	 * @return Orden
	 */
	OrderInfo findOrderInfo(String shortCode) {
		Integer orderNumber = orderDataService.find(shortCode)
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
	 * Busca la revisión asociada al número de orden
	 * @param orderNumber Número de orden
	 * @return Revisión
	 */
	InspectionVehicle findInspection(int orderNumber) {
		LOG.info(new Log((Map) [orderNumber: orderNumber, message: Constants.Message.FINDING_INSPECTION]).toString())
		List<Integer> articles = orderDataService.find(orderNumber).lines*.articleCode.toList()
		List<InspectionVehicle> inspectionsVehicle = inspectionVehicleDataService.findAll(articles)
		InspectionVehicle inspectionVehicle = null
		if (inspectionsVehicle) {
			inspectionVehicle = buildGroupedInspection(inspectionsVehicle)
		}
		LOG.info(new Log((Map) [orderNumber: orderNumber, inspectionTypeCode: inspectionVehicle?.inspectionType?.code, vehicle: inspectionVehicle?.vehicle, message: Constants.Message.FIND_INSPECTION_RESULT]).toString())
		return inspectionVehicle
	}

	/**
	 * Construye una revisión agrupada con todos los items de las recibidas como parámetro
	 * @param inspections Lista de revisiones
	 * @return Revisión con items agrupados
	 */
	static InspectionVehicle buildGroupedInspection(List<InspectionVehicle> inspectionsVehicle) {
		InspectionVehicle inspectionVehicle = null
		if (inspectionsVehicle) {
			/* Se obtienen el código y nombre de la revisión con mayor número de items */
			InspectionVehicle maxInspection = inspectionsVehicle.max { it.items.size() }
			List<Item> items = ((List<Item>) inspectionsVehicle.items.flatten()).unique { it.code }
			inspectionVehicle = Builder.buildInspectionVehicle(maxInspection, items)
		}
		return inspectionVehicle
	}

	/**
	 * Guarda o actualiza una revisión
	 * @param inspection Revisión
	 * @param orderNumber Número de orden
	 * @param employeeCode Código del empleado que guarda la revisión
	 * @return Revisión guardada
	 */
	SavedInspection saveInspection(SavedInspection savedInspection, int orderNumber, String employeeCode) {
		LOG.info(new Log((Map) [orderNumber: orderNumber, inspectionTypeCode: savedInspection.inspectionTypeCode, vehicle: savedInspection.vehicle, employeeCode: employeeCode, message: Constants.Message.SAVING_INSPECTION]).toString())
		SavedInspection newSavedInspection = null
		try {
			SavedInspection existent = savedInspectionDataService.find(orderNumber)
			LOG.info(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, inspectionTypeCode: savedInspection.inspectionTypeCode, vehicle: savedInspection.vehicle, existent: existent as boolean, message: Constants.Message.EXISTENT_INSPECTION]).toString())

			/* Si existe una revisión para ese número de serie, se actualizan los elementos */
			if (existent) {
				newSavedInspection = savedInspectionDataService.update(savedInspection, existent)
			} else {
				newSavedInspection = savedInspectionDataService.save(savedInspection)
			}
			LOG.info(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, inspectionTypeCode: savedInspection.inspectionTypeCode, vehicle: savedInspection.vehicle, message: Constants.Message.SAVED_INSPECTION]).toString())
		} catch (all) {
			all.printStackTrace()
			LOG.error(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, inspectionTypeCode: savedInspection.inspectionTypeCode, vehicle: savedInspection.vehicle, exceptionMessage: all.message, message: Constants.Message.ERROR_SAVING_INSPECTION]).toString())
		}
		return newSavedInspection
	}

}
