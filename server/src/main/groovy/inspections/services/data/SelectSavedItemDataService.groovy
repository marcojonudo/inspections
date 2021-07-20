package inspections.services.data

import grails.gorm.services.Service
import inspections.domains.savedItems.SelectSavedItem

import java.time.LocalDateTime

@Service(SelectSavedItem)
interface SelectSavedItemDataService {

	SelectSavedItem update(Serializable id, String value, String employeeCode, boolean hidden, LocalDateTime filled)

}
