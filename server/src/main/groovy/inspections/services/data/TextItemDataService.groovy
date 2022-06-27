package inspections.services.data

import grails.gorm.services.Service
import grails.gorm.services.Where
import inspections.domains.items.TextItem

@Service(TextItem)
interface TextItemDataService {

	TextItem find(Long id)

	@Where({ id in ids })
	List<TextItem> findAll(List<Long> ids)

}
