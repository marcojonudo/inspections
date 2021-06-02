package inspections.services.data

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.domains.schedules.EmployeeData
import inspections.utils.Constants

@Service(EmployeeData)
@Transactional(connection = Constants.DataSource.SCHEDULES)
interface EmployeeDataDataService {

	List<EmployeeData> findAll()

}

