package inspections.utils

import groovy.transform.CompileStatic
import inspections.domains.InspectionVehicle
import inspections.domains.SavedInspection
import inspections.domains.items.Item
import inspections.pogos.slack.messages.SlackBlocksMessage
import inspections.pogos.slack.messages.SlackMessage
import inspections.pogos.slack.structure.blocks.SlackBlock
import inspections.pogos.slack.structure.blocks.SlackFieldsBlock
import inspections.pogos.slack.structure.elements.SlackBaseElem
import inspections.pogos.slack.structure.elements.SlackMarkdownElem

import java.time.LocalDateTime

@CompileStatic
class Builder {

	static InspectionVehicle buildInspectionVehicle(
		InspectionVehicle inspectionVehicle, List<Item> items, boolean orderInspection = true
	) {
		items.each {
			it.vehicleData = it.vehicleDataList.find { it.vehicle == inspectionVehicle.vehicle }
		}
		return new InspectionVehicle(
			inspectionVehicle.inspectionType,
			inspectionVehicle.vehicle,
			items.findAll { it.vehicleData }.toSet(),
			orderInspection
		)
	}

	static SavedInspection buildSavedInspection(
		InspectionVehicle inspection, int orderNumber, String employeeCode, String numberPlate
	) {
		return new SavedInspection(
			inspection.inspectionType.code,
			inspection.vehicle,
			orderNumber,
			employeeCode,
			numberPlate,
			SavedInspection.State.STARTED,
			inspection.orderInspection,
			LocalDateTime.now()
		)
	}

	class Slack {

		static SlackBlock buildExceptionBlock(Exception e) {
			new SlackFieldsBlock([
				new SlackMarkdownElem(":boom: *Exception:*\n${e.getClass().simpleName}"),
				new SlackMarkdownElem(":memo: *Error message:*\n$e.message")
			] as List<SlackBaseElem>)
		}

		static SlackMessage buildSavedInspectionMessage(SavedInspection savedInspection, int centre, Exception e) {
			List<SlackBlock> blocks = [buildExceptionBlock(e)]
			blocks << new SlackFieldsBlock([
				new SlackMarkdownElem(":classical_building: *Centre:* $centre"),
				new SlackMarkdownElem(":label: *Order:* $savedInspection.orderNumber"),
			] as List<SlackBaseElem>)
			blocks << new SlackFieldsBlock([
				new SlackMarkdownElem(":car: *Number plate:* $savedInspection.numberPlate"),
				new SlackMarkdownElem(":man-raising-hand: *Employee code:* $savedInspection.employeeCode")
			] as List<SlackBaseElem>)
			return new SlackBlocksMessage(blocks)
		}

	}

}
