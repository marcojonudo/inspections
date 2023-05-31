package inspections.utils

import groovy.transform.CompileStatic
import inspections.domains.InspectionVehicle
import inspections.domains.SaveError
import inspections.domains.SavedInspection
import inspections.domains.SavedInspectionData
import inspections.domains.items.Item
import inspections.domains.savedItems.SavedItem
import inspections.pogos.slack.messages.SlackBlocksMessage
import inspections.pogos.slack.messages.SlackMessage
import inspections.pogos.slack.structure.blocks.*
import inspections.pogos.slack.structure.elements.SlackBaseElem
import inspections.pogos.slack.structure.elements.SlackMarkdownElem
import inspections.pogos.slack.structure.elements.SlackPlainTextElem

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
		int orderNumber,
		String employeeCode,
		String inspectionTypeCode,
		String vehicle,
		String numberPlate,
		boolean orderInspection
	) {
		return new SavedInspection(
			inspectionTypeCode,
			vehicle,
			orderNumber,
			numberPlate,
			SavedInspection.State.STARTED,
			orderInspection
		).tap {
			addToData(new SavedInspectionData(
				employeeCode,
				SavedInspectionData.Origin.INSPECTIONS,
				SavedInspectionData.Reason.SAVED,
				LocalDateTime.now())
			)
			items = (Set<SavedItem>) []
		}
	}

	class Slack {

		static SlackBlock buildExceptionBlock(Exception e) {
			new SlackFieldsBlock([
				new SlackMarkdownElem(":boom: *Exception:*\n${e.getClass().simpleName}"),
				new SlackMarkdownElem(":memo: *Error message:*\n$e.message")
			] as List<SlackBaseElem>)
		}

		static List<SlackBlock> buildBaseInfoBlocks(
			String message,
			int centre,
			int orderNumber,
			String employeeCode,
			String numberPlate,
			List<SlackBlock> blocks = []
		) {
			blocks << new SlackHeaderBlock(new SlackPlainTextElem(message))
			blocks << new SlackContextBlock([
				(SlackBaseElem) new SlackMarkdownElem("$centre | $orderNumber | $numberPlate | $employeeCode")
			])
			blocks << new SlackDividerBlock()
			return blocks
		}

		static SlackMessage buildSavedInspectionErrorMessage(SavedInspection savedInspection, int centre, Exception e) {
			List<SlackBlock> blocks = buildBaseInfoBlocks(
				Constants.Message.ERROR_SAVING_INSPECTION,
				centre,
				savedInspection.orderNumber,
				savedInspection.findData().employeeCode,
				savedInspection.numberPlate
			)
			blocks << buildExceptionBlock(e)
			return new SlackBlocksMessage(blocks)
		}

		static SlackMessage buildSaveErrorMessage(SaveError saveError, int centre) {
			List<SlackBlock> blocks = buildBaseInfoBlocks(
				Constants.Message.ERROR_SAVING_INSPECTION,
				centre,
				saveError.orderNumber,
				saveError.employeeCode,
				saveError.numberPlate
			)
			blocks << new SlackFieldsBlock([
				new SlackMarkdownElem(":1234: *Status code:*\n$saveError.statusCode"),
				new SlackMarkdownElem(":memo: *Error message:*\n$saveError.error")
			] as List<SlackBaseElem>)
			return new SlackBlocksMessage(blocks)
		}

	}

}
