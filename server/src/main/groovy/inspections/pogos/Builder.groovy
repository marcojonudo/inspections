package inspections.pogos

import groovy.transform.CompileStatic
import inspections.domains.GaragePosition
import inspections.domains.ItemCategory
import inspections.domains.SavedInspection
import inspections.domains.items.Item
import inspections.domains.savedItems.SavedItem
import inspections.domains.savedItems.SelectSavedItem
import inspections.domains.savedItems.TextSavedItem
import inspections.utils.Constants

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@CompileStatic
class Builder {

	private static fillSavedItem(SavedItem savedItem, Map<String, Object> item) {
		Map<String, Object> category = (Map<String, Object>) ((Map<String, Object>) item.item).category
		Map<String, Object> garagePosition = (Map<String, Object>) ((Map<String, Object>) item.item).garagePosition
		savedItem.item = new Item(
			type: Item.Type.valueOf((String) ((Map<String, Object>) item.item).type),
			code: (String) ((Map<String, Object>) item.item).code,
			category: category ? new ItemCategory(code: (String) category.code, name: (String) category.name) : null,
			garagePosition: garagePosition ? new GaragePosition(code: (String) garagePosition.code, name: (String) garagePosition.name) : null
		)
		savedItem.employeeCode = item.employeeCode
		savedItem.hidden = item.hidden
		if (item.image) {
			savedItem.image = ((String) item.image).decodeBase64()
		}
		savedItem.filled = (LocalDateTime) (item.filled ? LocalDateTime.parse(
			(String) item.filled, DateTimeFormatter.ofPattern(Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss)
		) : null)
		return savedItem
	}

	static TextSavedItem buildTextSavedItem(Map<String, Object> item) {
		TextSavedItem savedItem = new TextSavedItem(text: (String) item.text)
		return (TextSavedItem) fillSavedItem(savedItem, item)
	}

	static SelectSavedItem buildSelectSavedItem(Map<String, Object> item) {
		SelectSavedItem savedItem = new SelectSavedItem(value: (String) item.value)
		return (SelectSavedItem) fillSavedItem(savedItem, item)
	}

	static SavedInspection buildSavedInspection(SavedInspection inspection) {
		return new SavedInspection(
			name: inspection.name, orderNumber: inspection.orderNumber, saved: inspection.saved, items: inspection.items
		)
	}

}
