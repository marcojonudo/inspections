package inspections.services.data

import grails.gorm.services.Service
import inspections.domains.savedItems.TextSavedItem
import inspections.domains.savedItems.TextSavedItemField

import javax.inject.Inject

@Service(TextSavedItem)
abstract class TextSavedItemDataService {

	@Inject TextSavedItemFieldDataService textSavedItemFieldDataService

	TextSavedItem update(TextSavedItem savedItem, Set<TextSavedItemField> fields) {
		fields.each { TextSavedItemField field ->
			TextSavedItemField existent = savedItem.fields.find { it.order == field.order }
			if (existent) {
				textSavedItemFieldDataService.update(savedItem, field.order, field.text)
			} else {
				field.textSavedItem = savedItem
				textSavedItemFieldDataService.save(field)
			}
		}
		return savedItem
	}

}
