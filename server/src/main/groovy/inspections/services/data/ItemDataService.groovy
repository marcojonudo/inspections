package inspections.services.data


import grails.gorm.services.Service
import grails.gorm.services.Where
import inspections.domains.items.Item

@Service(Item)
interface ItemDataService {

	Item find(String code)

    @Where({ code in codes })
    List<Item> findAll(List<String> codes)

}
