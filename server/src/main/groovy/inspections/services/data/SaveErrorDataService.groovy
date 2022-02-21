package inspections.services.data

import grails.gorm.services.Service
import inspections.domains.SaveError

@Service(SaveError)
interface SaveErrorDataService {

    SaveError save(SaveError inspectionSaveError)

}
