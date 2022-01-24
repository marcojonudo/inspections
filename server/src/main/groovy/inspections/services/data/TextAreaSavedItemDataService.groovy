package inspections.services.data

import grails.gorm.services.Service
import inspections.domains.savedItems.TextAreaSavedItem

@Service(TextAreaSavedItem)
interface TextAreaSavedItemDataService {

	TextAreaSavedItem update(Serializable id, String text)

}
