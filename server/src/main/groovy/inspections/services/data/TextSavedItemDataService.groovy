package inspections.services.data

import grails.gorm.services.Service
import inspections.domains.savedItems.TextSavedItem

@Service(TextSavedItem)
interface TextSavedItemDataService {

	TextSavedItem update(Serializable id, String text)

}
