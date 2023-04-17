package inspections.services

import groovy.transform.CompileStatic
import inspections.clients.DbApiClient
import inspections.clients.InspectionsManagementClient
import inspections.clients.OrdersManagementClient
import inspections.domains.InspectionType
import inspections.domains.InspectionVehicle
import inspections.domains.SavedInspection
import inspections.domains.SavedInspectionData
import inspections.domains.fviberi.Order
import inspections.domains.items.Item
import inspections.domains.items.TextItem
import inspections.domains.items.TextItemField
import inspections.domains.items.TextItemFieldValue
import inspections.domains.savedItems.SavedItem
import inspections.domains.savedItems.SelectSavedItemData
import inspections.domains.savedItems.TextSavedItemData
import inspections.domains.savedItems.TextSavedItemDataField
import inspections.pogos.budgets.*
import inspections.pogos.logs.Log
import inspections.services.data.*
import inspections.services.data.fviberi.CarDataService
import inspections.services.data.fviberi.CentreDataService
import inspections.services.data.fviberi.OrderDataService
import inspections.utils.Builder
import inspections.utils.Constants
import inspections.utils.Utils
import io.micronaut.http.HttpResponse
import io.micronaut.http.HttpStatus
import io.micronaut.http.client.exceptions.HttpClientResponseException
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.inject.Inject
import javax.inject.Singleton
import java.time.LocalDate
import java.util.concurrent.CompletableFuture
import java.time.LocalTime
import java.time.temporal.ChronoUnit

@Singleton
@CompileStatic
class InspectionService {

	private static final Logger LOG = LoggerFactory.getLogger(InspectionService)

	private static final int ITV_FIELDS_SIZE = 2
	private static final int TYRE_MEASUREMENT_FIELDS_SIZE = 5

	@Inject OrderDataService orderDataService
	@Inject CentreDataService centreDataService
	@Inject CarDataService carDataService
	@Inject InspectionVehicleDataService inspectionVehicleDataService
	@Inject SavedInspectionDataService savedInspectionDataService
	@Inject SlackService slackService
	@Inject InspectionsManagementClient inspectionsManagementClient
	@Inject ItemDataService itemDataService
	@Inject TextItemDataService textItemDataService
	@Inject TextItemFieldValueDataService textItemFieldValueDataService
	@Inject OrdersManagementClient ordersManagementClient
	@Inject DbApiClient dbApiClient

	/**
	 * Busca una orden asociada al código corto
	 * @param shortCode Código corto de la orden
	 * @return Orden
	 */
	Order findOrder(String shortCode, String employeeCode) {
		LOG.info(new Log((Map) [message: Constants.Message.SEARCHING_ORDER, employeeCode: employeeCode, shortCode: shortCode]).toString())
		Integer orderNumber = shortCode.isNumber() && shortCode.size() > 5 ?
			shortCode as int : orderDataService.find(shortCode)
		Order order = orderNumber ? orderDataService.find(orderNumber) : null
		LOG.info(new Log((Map) [message: Constants.Message.FINISHED_SEARCHING_ORDER, orderNumber: orderNumber, employeeCode: employeeCode, shortCode: shortCode]).toString())
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
		LOG.info(new Log((Map) [message: Constants.Message.SEARCHING_INSPECTION, orderNumber: orderNumber, employeeCode: employeeCode]).toString())
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
		LOG.info(new Log((Map) [message: Constants.Message.FINISHED_SEARCHING_INSPECTION, orderNumber: orderNumber, employeeCode: employeeCode, inspectionTypeCode: inspectionVehicle.inspectionType.code, vehicle: inspectionVehicle.vehicle, orderInspection: inspectionVehicle.orderInspection]).toString())
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
		LOG.info(new Log((Map) [message: Constants.Message.SEARCHING_SAVED_INSPECTION, orderNumber: orderNumber, employeeCode: employeeCode, inspectionTypeCode: inspectionTypeCode, vehicle: vehicle, numberPlate: numberPlate, orderInspection: orderInspection]).toString())
		SavedInspection savedInspection = savedInspectionDataService.find(orderNumber)
		LOG.info(new Log((Map) [message: Constants.Message.EXISTENT_SAVED_INSPECTION, orderNumber: orderNumber, employeeCode: employeeCode, inspectionTypeCode: inspectionTypeCode, vehicle: vehicle, numberPlate: numberPlate, orderInspection: orderInspection, existent: savedInspection as boolean]).toString())
		/* Si existe revisión y se ha actualizado el tipo de revisión (en lo que respecta a la orden), se actualiza */
		if (savedInspection) {
			if (savedInspection.updatedOrder(inspectionTypeCode, orderInspection)) {
				LOG.info(new Log((Map) [message: Constants.Message.UPDATED_ORDER, orderNumber: orderNumber, employeeCode: employeeCode, inspectionTypeCode: inspectionTypeCode, vehicle: vehicle, numberPlate: numberPlate, orderInspection: orderInspection, oldType: savedInspection.inspectionTypeCode, newType: inspectionTypeCode, oldOrderInspection: savedInspection.orderInspection, newOrderInspection: orderInspection]).toString())
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
		LOG.info(new Log((Map) [message: Constants.Message.FINISHED_SEARCHING_SAVED_INSPECTION, orderNumber: orderNumber, employeeCode: employeeCode, inspectionTypeCode: inspectionTypeCode, vehicle: vehicle, numberPlate: numberPlate, orderInspection: orderInspection, existent: savedInspection as boolean]).toString())
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
		LOG.info(new Log((Map) [message: Constants.Message.SAVING_INSPECTION, employeeCode: employeeCode, savedInspection: savedInspection]).toString())
		SavedInspection newSavedInspection = null
		try {
			/* Se utiliza un semáforo por número de orden para evitar escrituras simultáneas */
			SavedInspection existent = savedInspectionDataService.find(orderNumber)

			LocalTime refTime = LocalTime.now()
			newSavedInspection = savedInspectionDataService.update(savedInspection, existent)
			LOG.info(new Log((Map) [message: Constants.Message.SAVE_INSPECTION_DURATION, orderNumber: orderNumber, duration: ChronoUnit.MILLIS.between(refTime, LocalTime.now())]).toString())

			updateItvDate(savedInspection)
			CompletableFuture.runAsync({
				handleBudgetCreation(savedInspection)
			})
			inspectionsManagementClient.notifySavedInspection(newSavedInspection).subscribe()

			LOG.info(new Log((Map) [message: Constants.Message.SAVED_INSPECTION, orderNumber: orderNumber, employeeCode: employeeCode, inspectionTypeCode: savedInspection.inspectionTypeCode, vehicle: savedInspection.vehicle, state: savedInspection.state, orderInspection: savedInspection.orderInspection]).toString())
		} catch (all) {
			all.printStackTrace()
			LOG.error(new Log((Map) [message: Constants.Message.ERROR_SAVING_INSPECTION, orderNumber: orderNumber, employeeCode: employeeCode, inspectionTypeCode: savedInspection.inspectionTypeCode, vehicle: savedInspection.vehicle, state: savedInspection.state, orderInspection: savedInspection.orderInspection, exceptionMessage: all.message]).toString())
			slackService.sendMessage(Builder.Slack.buildSavedInspectionErrorMessage(savedInspection, centre, all))
		}
		return newSavedInspection
	}

	static Optional<Integer> findInspectionDuration(Set<SavedInspectionData> inspectionDataList) {
		/* Se toma como referencia el primer registro de guardado, que corresponde con el momento en que abren la
		 * revisión */
		SavedInspectionData refItemData = inspectionDataList.find { it.reason == SavedInspectionData.Reason.SAVED }
		/* Para calcular la revisión, se usan sólo los registros del mismo día */
		SavedInspectionData lastUpdate = inspectionDataList.findAll {
			it.reason == SavedInspectionData.Reason.UPDATED && it.saved.toLocalDate() == refItemData.saved.toLocalDate()
		}.max { it.saved }

		return Optional.ofNullable(lastUpdate)
			.map { d -> (int) refItemData.saved.until(d.saved, ChronoUnit.SECONDS) }
	}

	/**
	 * Actualiza la fecha de la próxima ITV en fviberi
	 * @param savedInspection Revisión guardada
	 */
	void updateItvDate(SavedInspection savedInspection) {
		SavedItem savedItem = savedInspection.items.find { it.code == Constants.Item.FPITV }
		/* En una anomalía detectada, podría no haber fecha de ITV */
		if (savedItem) {
            TextSavedItemData data = (TextSavedItemData) savedItem.data.max { it.saved }
            List<TextSavedItemDataField> fields = data.fields.sort { it.order }
			LocalDate day = findItvDate(fields)
			if (day) {
				carDataService.update(savedInspection.numberPlate, Utils.formatItvDate(day), Utils.parseExpiredItv(day))
			} else {
				String value = "${fields.find { it.order == 0 }?.text}/${fields.find { it.order == 1 }?.text}"
				LOG.info(new Log((Map) [message: Constants.Message.WRONG_FPITV_FIELD, orderNumber: savedInspection.orderNumber, employeeCode: savedInspection.findData().employeeCode, inspectionTypeCode: savedInspection.inspectionTypeCode, vehicle: savedInspection.vehicle, state: savedInspection.state, orderInspection: savedInspection.orderInspection, fields: value]).toString())
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

	/**
	 * Gestiona la creación de un presupuesto de neumáticos
	 * @param savedInspection Revisión guardada
	 * @return Lista de códigos de artículo
	 */
	Budget handleBudgetCreation(SavedInspection savedInspection) {
		/* Se comprueba que en la revisión haya información necesaria para crear el presupuesto */
		BudgetData budgetData = findBudgetFields(savedInspection)
		if (!budgetData) { return null }

		/* Se buscan los códigos de artículo a presupuestar */
		List<Article> budgetArticles = findBudgetArticles(budgetData.tyreData, budgetData.units, savedInspection.orderNumber)
		if (!budgetArticles) { return null }

		/* Se comprueba que no exista otro presupuesto para esos mismos artículos en BD */
		boolean create = checkCreateBudget(savedInspection.orderNumber, budgetArticles.code)
		return create ? createBudget(budgetArticles, savedInspection.orderNumber, budgetData.units) : null
	}

	/**
	 * Obtiene la información de revisión necesaria para crear un presupuesto
	 * @param savedInspection Revisión guardada
	 * @return Información de revisión
	 */
	static BudgetData findBudgetFields(SavedInspection savedInspection) {
		/* Se comprueba que exista valor para el item de la medida del neumático */
		TyreMeasurementData tyreData = findTyreMeasurementData(
			savedInspection.items.find { it.code == Constants.Item.PN }
		)
		if (!tyreData) {
			LOG.error(new Log((Map) [orderNumber: savedInspection.orderNumber, employeeCode: savedInspection.findData().employeeCode, inspectionTypeCode: savedInspection.inspectionTypeCode, vehicle: savedInspection.vehicle, state: savedInspection.state, orderInspection: savedInspection.orderInspection, message: Constants.Message.INCOMPLETE_FIELDS]).toString())
			return null
		}

		/* Se comprueba si hay algún item de neumático en mal estado */
		Set<SavedItem> wrongTyreItems = findTyreWrongItems(savedInspection.items)
		if (!wrongTyreItems) {
			LOG.info(new Log((Map) [orderNumber: savedInspection.orderNumber, employeeCode: savedInspection.findData().employeeCode, inspectionTypeCode: savedInspection.inspectionTypeCode, vehicle: savedInspection.vehicle, state: savedInspection.state, orderInspection: savedInspection.orderInspection, message: Constants.Message.CORRECT_TYRE_ITEMS]).toString())
			return null
		}

		float units = findTyreUnits(wrongTyreItems)
		return new BudgetData(tyreData, units)
	}

	/**
	 * Filtra los items de neumático en mal estado
	 * @param savedItems Items guardados
	 * @param tyreCodes Códigos de neumáticos
	 * @return Lista de items de neumáticos en mal estado
	 */
	static Set<SavedItem> findTyreWrongItems(
		Set<SavedItem> savedItems, List<String> tyreCodes = Constants.TYRE_STATE_CODES
	) {
		return savedItems
			.findAll { it.code in tyreCodes }
			.findAll {
				SelectSavedItemData data = (SelectSavedItemData) it.findData()
				return data.value != Constants.PENDING_SELECT_OPTION && !data.isCorrect()
			}
	}

	/**
	 * Obtiene, si todos los campos están rellenos, los campos de la medida del neumático
	 * @param savedItem Item guardado
	 * @param fieldsSize Número de campos del item
	 * @return Campos del item
	 */
	static TyreMeasurementData findTyreMeasurementData(
		SavedItem savedItem, int fieldsSize = TYRE_MEASUREMENT_FIELDS_SIZE
	) {
		Set<TextSavedItemDataField> fields = ((TextSavedItemData) savedItem.findData()).fields

		/* Si hay 5 campos con texto, la información está completa y correcta, por lo que se puede hacer pto */
		return fields.size() == fieldsSize && !fields.find { !it.text } ? new TyreMeasurementData(
			fields.find { it.order == 0 }.text,
			fields.find { it.order == 1 }.text,
			fields.find { it.order == 2 }.text,
			fields.find { it.order == 3 }.text,
			fields.find { it.order == 4 }.text
		) : null
	}

	/**
	 * Obtiene el código de artículo a presupuestar
	 * @param tyreData Medidas del neumático
	 * @param units Unidades necesarias
	 * @param orderNumber Número de orden
	 * @return Código de artículo a presupuestar
	 */
	List<Article> findBudgetArticles(TyreMeasurementData tyreData, float units, int orderNumber) {
		List<Article> budgetArticles = null
		try {
			HttpResponse<List<Article>> tyreArticlesResponse = ordersManagementClient.findTyreBudget(
				tyreData.measurement, tyreData.serialNumber, tyreData.tyre, tyreData.load, tyreData.speed, units
			)
			budgetArticles = tyreArticlesResponse.body()
			LOG.info(new Log((Map) [orderNumber: orderNumber, budgetArticles: budgetArticles.code, message: Constants.Message.TYRE_BUDGET_ARTICLE_CODES]).toString())
		} catch (all) {
			LOG.error(new Log((Map) [orderNumber: orderNumber, exception: all.class.simpleName, exceptionMessage: all.message, message: Constants.Message.WRONG_ORDERS_MANAGEMENT_REQUEST]).toString())
		}
		return budgetArticles
	}

	boolean checkCreateBudget(int orderNumber, List<Integer> articleCodes) {
		boolean create = false
		try {
			List<Budget> existent = dbApiClient.findBudgets(orderNumber)
			create = existent ?
				!existent.find { it.lines.find { BudgetLine l -> l.article.code in articleCodes } } :
				true
			LOG.info(new Log((Map) [orderNumber: orderNumber, existentBudget: existent, message: Constants.Message.ALREADY_EXISTENT_BUDGET]).toString())
		} catch (all) {
			if (!(all instanceof HttpClientResponseException) ||
					(all as HttpClientResponseException).status != HttpStatus.NOT_FOUND) {
				all.printStackTrace()
				LOG.error(new Log((Map) [orderNumber: orderNumber, message: Constants.Message.ERROR_REQUESTING_BUDGET]).toString())
			}
		}
		return create
	}

	/**
	 * Calcula las unidades de neumáticos a presupuestar
	 * @param tyreSavedItems Lista de items de neumáticos
	 * @param frontTyreCodes Códigos de items de neumáticos frontales
	 * @param backTyreCodes Códigos de items de neumáticos traseros
	 * @return Unidades a presupuestar
	 */
	static float findTyreUnits(
		Set<SavedItem> tyreSavedItems,
		List<String> frontTyreCodes = Constants.FRONT_TYRE_CODES,
		List<String> backTyreCodes = Constants.BACK_TYRE_CODES
	) {
		boolean frontTyres = tyreSavedItems.find { SavedItem item -> item.code in frontTyreCodes }
		boolean backTyres = tyreSavedItems.find { SavedItem item -> item.code in backTyreCodes }
		return (frontTyres ? 2 : 0) + (backTyres ? 2 : 0)
	}

	/**
	 * Actualiza los valores por defecto de items de texto en función del año actual
	 */
	void updateTextValues() {
		TextItem itvItem = textItemDataService.find(itemDataService.findItemId(Constants.Item.FPITV))
		List<TextItem> tyreAgeItems = textItemDataService.findAll(
			itemDataService.findAllItemId(Constants.TYRE_AGE_CODES)
		)
		LocalDate today = LocalDate.now()
		handleTextItemYearValue(itvItem, today.plusYears(5).year)
		tyreAgeItems.each { handleTextItemYearValue(it, "$today.year"[2..-1] as int) }
	}

	Budget createBudget(List<Article> budgetArticles, int orderNumber, float units) {
		Budget budget = null
		try {
			HttpResponse response = ordersManagementClient.createBudget(
				budgetArticles.collect { it.clone(units) }, orderNumber
			)
			budget = response.body()
			LOG.info(new Log((Map) [orderNumber: orderNumber, budget: budget.number, message: Constants.Message.CREATED_BUDGET]).toString())
		} catch (all) {
			all.printStackTrace()
			LOG.error(new Log((Map) [orderNumber: orderNumber, exception: all.class.simpleName, exceptionMessage: all.message, message: Constants.Message.WRONG_CREATE_BUDGET_REQUEST]).toString())
		}
		return budget
	}

	/**
	 * Actualiza los valores por defecto de un item de texto en función del año de referencia
	 * @param item Item de texto
	 * @param refYear Año de referencia
	 * @return Lista de valores actualizados
	 */
	List<TextItemFieldValue> handleTextItemYearValue(TextItem item, int refYear) {
		List<TextItemFieldValue> values = []
		TextItemField yearField = item.fields.find { it.order == 1 }
		int maxYear = yearField.values*.value.max { it as int } as int
		if (maxYear < refYear) {
			yearField.values.each {
				values << textItemFieldValueDataService.update(it.id, ((it.value as int) + 1) as String)
			}
		}
		return values
	}

}
