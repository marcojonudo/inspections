package inspections.services.data


import grails.gorm.services.Service
import inspections.domains.items.Item
import inspections.domains.items.ItemVehicleData

@Service(ItemVehicleData)
interface ItemVehicleDataDataService {

	Item find(String code)

}
