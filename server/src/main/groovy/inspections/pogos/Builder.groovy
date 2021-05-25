package inspections.pogos


import groovy.transform.CompileStatic
import inspections.domains.GaragePosition
import inspections.domains.ItemCategory
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
			name: (String) ((Map<String, Object>) item.item).name,
			category: new ItemCategory(code: (String) category.code, name: (String) category.name),
			garagePosition: new GaragePosition(code: (String) garagePosition.code, name: (String) garagePosition.name)
		)
		savedItem.employeeCode = item.employeeCode
		savedItem.filled = LocalDateTime.parse(
			(String) item.filled, DateTimeFormatter.ofPattern(Constants.DateTimeFormat.yyyy_MM_dd_T_HH_mm_ss_SSSS_Z)
		)
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

}
