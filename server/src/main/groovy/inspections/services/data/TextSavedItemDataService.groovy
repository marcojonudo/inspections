package inspections.services.data

import grails.gorm.services.Service
import inspections.domains.savedItems.TextSavedItem

import java.time.LocalDateTime

@Service(TextSavedItem)
interface TextSavedItemDataService {

	TextSavedItem update(
		Serializable id, String text, String employeeCode, boolean hidden, byte[] image, LocalDateTime filled
	)

}
