package inspections.services

import groovy.transform.CompileStatic
import inspections.clients.InspectionsManagementClient
import inspections.domains.InspectionType
import inspections.domains.InspectionVehicle
import inspections.domains.SavedInspection
import inspections.domains.fviberi.Centre
import inspections.domains.fviberi.Order
import inspections.domains.items.Item
import inspections.domains.savedItems.TextSavedItem
import inspections.domains.savedItems.TextSavedItemField
import inspections.pogos.OrderInfo
import inspections.pogos.logs.Log
import inspections.services.data.*
import inspections.utils.Builder
import inspections.utils.Constants
import inspections.utils.Utils
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.inject.Inject
import javax.inject.Singleton
import java.time.LocalDate

@Singleton
@CompileStatic
class InspectionService {

	private static final Logger LOG = LoggerFactory.getLogger(InspectionService)

	@Inject OrderDataService orderDataService
	@Inject CentreDataService centreDataService
	@Inject CarDataService carDataService
	@Inject InspectionVehicleDataService inspectionVehicleDataService
	@Inject SavedInspectionDataService savedInspectionDataService
	@Inject SlackService slackService
	@Inject InspectionsManagementClient inspectionsManagementClient

	/**
	 * Busca una orden asociada al código corto
	 * @param shortCode Código corto de la orden
	 * @return Orden
	 */
	OrderInfo findOrderInfo(String shortCode, String employeeCode) {
		LOG.info(new Log((Map) [employeeCode: employeeCode, shortCode: shortCode, message: Constants.Message.SEARCHING_ORDER]).toString())
		Integer orderNumber = orderDataService.find(shortCode)
		OrderInfo orderInfo = null
		if (orderNumber) {
			Order order = orderDataService.find(orderNumber)
			Centre centre = centreDataService.find()

			orderInfo = new OrderInfo(order, centre)
		}
		LOG.info(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, shortCode: shortCode, message: Constants.Message.FINISHED_SEARCHING_ORDER]).toString())
		return orderInfo
	}

	/**
	 * Busca la revisión asociada al número de orden
	 * @param orderNumber Número de orden
	 * @return Revisión
	 */
	InspectionVehicle findInspection(int orderNumber, String employeeCode) {
		LOG.info(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, message: Constants.Message.SEARCHING_INSPECTION]).toString())
		List<Integer> articles = orderDataService.find(orderNumber).lines*.articleCode.toList()
		List<InspectionVehicle> inspectionsVehicle = inspectionVehicleDataService.findAll(articles)

		/* Si existen revisiones asociadas a los códigos de artículo de la OR, se construye una revisión a partir de
		 * ellas. Si no, se obtiene por defecto una revisión de seguridad */
		InspectionVehicle inspectionVehicle
		if (inspectionsVehicle) {
			inspectionVehicle = buildGroupedInspection(inspectionsVehicle)
		} else {
			InspectionVehicle securityInspectionVehicle = inspectionVehicleDataService.find(
				InspectionType.Code.SE.toString(), InspectionVehicle.Vehicle.CAR.toString()
			)
			inspectionVehicle = Builder.buildInspectionVehicle(
				securityInspectionVehicle, securityInspectionVehicle.items.toList(), false
			)
		}
		LOG.info(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, inspectionTypeCode: inspectionVehicle.inspectionType.code, vehicle: inspectionVehicle.vehicle, orderInspection: inspectionVehicle.orderInspection, message: Constants.Message.FINISHED_SEARCHING_INSPECTION]).toString())
		return inspectionVehicle
	}

	/**
	 * Construye una revisión agrupada con todos los items de las recibidas como parámetro
	 * @param inspections Lista de revisiones
	 * @return Revisión con items agrupados
	 */
	static InspectionVehicle buildGroupedInspection(List<InspectionVehicle> inspectionsVehicle) {
		/* Se obtienen el código y nombre de la revisión con mayor número de items */
		InspectionVehicle maxInspection = inspectionsVehicle.max { it.items.size() }
		List<Item> items = ((List<Item>) inspectionsVehicle.items.flatten()).unique { it.code }
		return inspectionsVehicle ? Builder.buildInspectionVehicle(maxInspection, items) : null
	}

	/**
	 * Busca una revisión guardad en BD. También actualiza, si es necesario, el bit orderInspection
	 * @param orderNumber Número de orden
	 * @param orderInspection Booleano que indica si es revisión asociada a OR, o anomalías detectadas
	 * @return Revisión guardada
	 */
	SavedInspection findSavedInspection(int orderNumber, boolean orderInspection) {
		SavedInspection savedInspection = savedInspectionDataService.find(orderNumber)
		/* Puede darse el caso de que metan un CI de revisión (en cuyo caso, cuando la guarden, el bit orderInspection
		 * será true), y después quiten o cambien dicho CI. En esta situación, la revisión pasará a ser de anomalías
		 * detectadas, y deberá actualizarse el bit en BD */
		if (savedInspection && savedInspection.orderInspection != orderInspection) {
			savedInspection = savedInspectionDataService.update(savedInspection.id, orderInspection)
		}
		return savedInspection
	}

	/**
	 * Guarda o actualiza una revisión
	 * @param inspection Revisión
	 * @param orderNumber Número de orden
	 * @param employeeCode Código del empleado que guarda la revisión
	 * @param centre Código del centro
	 * @return Revisión guardada
	 */
	SavedInspection saveInspection(SavedInspection savedInspection, int orderNumber, String employeeCode, int centre) {
		LOG.info(new Log((Map) [savedInspection: savedInspection, message: Constants.Message.SAVING_INSPECTION]).toString())
		SavedInspection newSavedInspection = null
		try {
			SavedInspection existent = savedInspectionDataService.find(orderNumber)
			LOG.info(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, inspectionTypeCode: savedInspection.inspectionTypeCode, vehicle: savedInspection.vehicle, state: savedInspection.state, orderInspection: savedInspection.orderInspection, existent: existent as boolean, message: Constants.Message.EXISTENT_INSPECTION]).toString())

			/* Si existe una revisión para ese número de serie, se actualizan los elementos */
			if (existent) {
				newSavedInspection = savedInspectionDataService.update(savedInspection, existent)
			} else {
				newSavedInspection = savedInspectionDataService.save(savedInspection)
			}
			updateItvDate(newSavedInspection)
			inspectionsManagementClient.notifySavedInspection(newSavedInspection).subscribe()

			LOG.info(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, inspectionTypeCode: savedInspection.inspectionTypeCode, vehicle: savedInspection.vehicle, state: savedInspection.state, orderInspection: savedInspection.orderInspection, message: Constants.Message.SAVED_INSPECTION]).toString())
		} catch (all) {
			all.printStackTrace()
			LOG.error(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, inspectionTypeCode: savedInspection.inspectionTypeCode, vehicle: savedInspection.vehicle, state: savedInspection.state, orderInspection: savedInspection.orderInspection, exceptionMessage: all.message, message: Constants.Message.ERROR_SAVING_INSPECTION]).toString())
			slackService.sendMessage(Builder.Slack.buildSavedInspectionMessage(savedInspection, centre, all))
		}
		return newSavedInspection
	}

	/**
	 * Actualiza la fecha de la próxima ITV en fviberi
	 * @param savedInspection Revisión guardada
	 */
	void updateItvDate(SavedInspection savedInspection) {
		TextSavedItem savedItem = (TextSavedItem) savedInspection.items.find { it.item.code == Constants.Item.FPITV }
		if (savedItem) {
			List<TextSavedItemField> fields = savedItem.fields.sort { it.order }
			/* Sólo se actualiza la información de ITV si ambos campos tienen valor (mes y año) */
			if (fields.findAll { it.text }.size() == fields.size()) {
				LocalDate day = LocalDate.of(fields[1].text as int, fields[0].text as int, 1)
				carDataService.update(savedInspection.numberPlate, Utils.formatItvDate(day), Utils.parseExpiredItv(day))
			}
		}
	}

}
