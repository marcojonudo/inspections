package inspections.services.data

import grails.gorm.services.Service
import inspections.domains.savedItems.SelectSavedItem

@Service(SelectSavedItem)
interface SelectSavedItemDataService {

	SelectSavedItem update(Serializable id, String value)

}
