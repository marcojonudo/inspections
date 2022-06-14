package inspections.services

import groovy.transform.CompileStatic
import inspections.async.SaveInspectionSemaphore
import inspections.clients.InspectionsManagementClient
import inspections.domains.InspectionType
import inspections.domains.InspectionVehicle
import inspections.domains.SavedInspection
import inspections.domains.fviberi.Order
import inspections.domains.items.Item
import inspections.domains.savedItems.SavedItem
import inspections.domains.savedItems.TextSavedItemData
import inspections.domains.savedItems.TextSavedItemDataField
import inspections.pogos.logs.Log
import inspections.services.data.InspectionVehicleDataService
import inspections.services.data.SavedInspectionDataService
import inspections.services.data.fviberi.CarDataService
import inspections.services.data.fviberi.CentreDataService
import inspections.services.data.fviberi.OrderDataService
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

	private static final int ITV_FIELDS_SIZE = 2

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
	Order findOrder(String shortCode, String employeeCode) {
		LOG.info(new Log((Map) [employeeCode: employeeCode, shortCode: shortCode, message: Constants.Message.SEARCHING_ORDER]).toString())
		Integer orderNumber = shortCode.isNumber() && shortCode.size() > 5 ?
			shortCode as int : orderDataService.find(shortCode)
		Order order = orderNumber ? orderDataService.find(orderNumber) : null
		LOG.info(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, shortCode: shortCode, message: Constants.Message.FINISHED_SEARCHING_ORDER]).toString())
		return order
	}

	/**
	 * Busca la revisión asociada al número de orden
	 * @param orderNumber Número de orden
	 * @param employeeCode Código de empleado
	 * @param vehicle Tipo de vehículo
	 * @return Revisión
	 */
	InspectionVehicle findInspection(int orderNumber, String employeeCode, String vehicle) {
		LOG.info(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, message: Constants.Message.SEARCHING_INSPECTION]).toString())
		List<Integer> articles = orderDataService.find(orderNumber).lines*.articleCode.toList()
		List<InspectionVehicle> inspectionsVehicle = inspectionVehicleDataService.findAll(articles).findAll {
			it.vehicle == vehicle
		}

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
	 * @param employeeCode Código de empleado
	 * @param inspectionTypeCode Tipo de revisión
	 * @param vehicle Tipo de vehículo
	 * @param numberPlate Identificador de vehículo
	 * @param orderInspection Booleano que indica si es revisión asociada a OR, o anomalías detectadas
	 * @return Revisión guardada
	 */
	SavedInspection findSavedInspection(
		int orderNumber,
		String employeeCode,
		String inspectionTypeCode,
		String vehicle,
		String numberPlate,
		boolean orderInspection
	) {
		LOG.info(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, inspectionTypeCode: inspectionTypeCode, vehicle: vehicle, numberPlate: numberPlate, orderInspection: orderInspection, message: Constants.Message.SEARCHING_SAVED_INSPECTION]).toString())
		SavedInspection savedInspection = savedInspectionDataService.find(orderNumber)
		LOG.info(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, inspectionTypeCode: inspectionTypeCode, vehicle: vehicle, numberPlate: numberPlate, orderInspection: orderInspection, existent: savedInspection as boolean, message: Constants.Message.EXISTENT_SAVED_INSPECTION]).toString())
		/* Si existe revisión y se ha actualizado el tipo de revisión (en lo que respecta a la orden), se actualiza */
		if (savedInspection) {
			if (savedInspection.updatedOrder(inspectionTypeCode, orderInspection)) {
				LOG.info(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, inspectionTypeCode: inspectionTypeCode, vehicle: vehicle, numberPlate: numberPlate, orderInspection: orderInspection, oldType: savedInspection.inspectionTypeCode, newType: inspectionTypeCode, oldOrderInspection: savedInspection.orderInspection, newOrderInspection: orderInspection, message: Constants.Message.UPDATED_ORDER]).toString())
				savedInspection = savedInspectionDataService.update(
					savedInspection, inspectionTypeCode, orderInspection, employeeCode
				)
			}
		} else {
			/* Si no, se construye y guarda una revisión sin items para marcarla como empezada */
			SavedInspection builtInspection = Builder.buildSavedInspection(
				orderNumber, employeeCode, inspectionTypeCode, vehicle, numberPlate, orderInspection
			)
			savedInspection = savedInspectionDataService.save(builtInspection)
		}
		LOG.info(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, inspectionTypeCode: inspectionTypeCode, vehicle: vehicle, numberPlate: numberPlate, orderInspection: orderInspection, existent: savedInspection as boolean, message: Constants.Message.FINISHED_SEARCHING_SAVED_INSPECTION]).toString())
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
		LOG.info(new Log((Map) [employeeCode: employeeCode, savedInspection: savedInspection, message: Constants.Message.SAVING_INSPECTION]).toString())
		SavedInspection newSavedInspection = null
		try {
			/* Se utiliza un semáforo por número de orden para evitar escrituras simultáneas */
			SaveInspectionSemaphore.acquire(orderNumber)
			SavedInspection existent = savedInspectionDataService.find(orderNumber)
			LOG.info(new Log((Map) [orderNumber: orderNumber, employeeCode: employeeCode, inspectionTypeCode: savedInspection.inspectionTypeCode, vehicle: savedInspection.vehicle, state: savedInspection.state, orderInspection: savedInspection.orderInspection, existent: existent as boolean, message: Constants.Message.EXISTENT_INSPECTION]).toString())

			newSavedInspection = savedInspectionDataService.update(savedInspection, existent)
			SaveInspectionSemaphore.release(orderNumber)

			updateItvDate(savedInspection, centre)
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
	void updateItvDate(SavedInspection savedInspection, int centre) {
		SavedItem savedItem = savedInspection.items.find { it.code == Constants.Item.FPITV }
		/* En una anomalía detectada, podría no haber fecha de ITV */
		if (savedItem) {
            TextSavedItemData data = (TextSavedItemData) savedItem.data.max { it.saved }
            List<TextSavedItemDataField> fields = data.fields.sort { it.order }
			LocalDate day = findItvDate(fields)
			if (day) {
				carDataService.update(savedInspection.numberPlate, Utils.formatItvDate(day), Utils.parseExpiredItv(day))
			} else {
				slackService.sendMessage(Builder.Slack.buildItvDateErrorMessage(savedInspection, centre, fields))
			}
		}
	}

	/**
	 * Comprueba si el contenido de la fecha de ITV es correcto, en cuyo caso devuelve la fecha
	 * @param savedItem Item guardado
	 * @return LocalDate
	 */
	static LocalDate findItvDate(List<TextSavedItemDataField> savedFields) {
		LocalDate day = null
		/* Se guarda la fecha de la ITV si todos los campos necesarios están rellenos */
		boolean data = savedFields.size() == ITV_FIELDS_SIZE &&
			savedFields.findAll { it.text }.size() == savedFields.size()
		if (data) {
			try {
				day = LocalDate.of(savedFields[1].text as int, savedFields[0].text as int, 1)
			} catch (ignore) {}
		}
		return day
	}

}
