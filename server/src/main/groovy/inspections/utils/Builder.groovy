package inspections.utils

import groovy.transform.CompileStatic
import inspections.domains.InspectionVehicle
import inspections.domains.SaveError
import inspections.domains.SavedInspection
import inspections.domains.items.Item
import inspections.domains.savedItems.TextSavedItemField
import inspections.pogos.slack.messages.SlackBlocksMessage
import inspections.pogos.slack.messages.SlackMessage
import inspections.pogos.slack.structure.blocks.SlackBlock
import inspections.pogos.slack.structure.blocks.SlackDividerBlock
import inspections.pogos.slack.structure.blocks.SlackFieldsBlock
import inspections.pogos.slack.structure.blocks.SlackTextBlock
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

		static List<SlackBlock> buildBaseInfoBlocks(
			int centre,
			int orderNumber,
			String employeeCode,
			String numberPlate,
			List<SlackBlock> blocks = []
		) {
			blocks << new SlackFieldsBlock([
				new SlackMarkdownElem(":classical_building: *Centre:* $centre"),
				new SlackMarkdownElem(":label: *Order:* $orderNumber"),
			] as List<SlackBaseElem>)
			blocks << new SlackFieldsBlock([
				new SlackMarkdownElem(":car: *Number plate:* $numberPlate"),
				new SlackMarkdownElem(":man-raising-hand: *Employee code:* $employeeCode")
			] as List<SlackBaseElem>)
			return blocks
		}

		static SlackMessage buildSavedInspectionMessage(SavedInspection savedInspection, int centre, Exception e) {
			List<SlackBlock> blocks = buildBaseInfoBlocks(
				centre,
				savedInspection.orderNumber,
				savedInspection.employeeCode,
				savedInspection.numberPlate,
				[buildExceptionBlock(e)]
			)
			return new SlackBlocksMessage(blocks)
		}

		static SlackMessage buildItvDateErrorMessage(
			SavedInspection savedInspection, int centre, List<TextSavedItemField> savedFields
		) {
			List<SlackBlock> blocks = buildBaseInfoBlocks(
				centre,
				savedInspection.orderNumber,
				savedInspection.employeeCode,
				savedInspection.numberPlate
			)
			blocks << new SlackDividerBlock()
			blocks << new SlackTextBlock(
				new SlackMarkdownElem(":pencil: *Message*: $Constants.Message.WRONG_FPITV_FIELD")
			)
			TextSavedItemField monthField = savedFields.find { it.order == 0 }
			TextSavedItemField yearField = savedFields.find { it.order == 1 }
			blocks << new SlackFieldsBlock([
				new SlackMarkdownElem(":date: *Month*: ${monthField ? monthField.text ?: '-' : ''}"),
				new SlackMarkdownElem(":date: *Year*: ${yearField ? yearField.text ?: '-' : ''}"),
			] as List<SlackBaseElem>)
			return new SlackBlocksMessage(blocks)
		}

		static SlackMessage buildSaveErrorMessage(SaveError saveError, int centre) {
			List<SlackBlock> blocks = buildBaseInfoBlocks(
				centre, saveError.orderNumber, saveError.employeeCode, saveError.numberPlate
			)
			blocks << new SlackDividerBlock()
			blocks << new SlackTextBlock(
				new SlackMarkdownElem(":pencil: *Message*: $Constants.Message.ERROR_SAVING_INSPECTION")
			)
			blocks << new SlackFieldsBlock([
				new SlackMarkdownElem(":1234: *Status code:*\n$saveError.statusCode"),
				new SlackMarkdownElem(":memo: *Error message:*\n$saveError.error")
			] as List<SlackBaseElem>)
			return new SlackBlocksMessage(blocks)
		}

	}

}
