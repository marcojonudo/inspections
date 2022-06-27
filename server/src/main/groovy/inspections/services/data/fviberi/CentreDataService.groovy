package inspections.services.data.fviberi

import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.domains.fviberi.Centre
import inspections.utils.Constants

@Service(Centre)
@Transactional(connection = Constants.DataSource.FVIBERI)
interface CentreDataService {

	Centre find()

}
