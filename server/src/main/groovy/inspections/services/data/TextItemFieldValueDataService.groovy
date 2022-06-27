package inspections.services.data

import grails.gorm.services.Service
import inspections.domains.items.TextItemFieldValue

@Service(TextItemFieldValue)
interface TextItemFieldValueDataService {

	TextItemFieldValue update(Serializable id, String value)

}
